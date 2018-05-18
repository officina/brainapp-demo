package cc.officina.gatorade.web.rest;

import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Request;
import cc.officina.gatorade.domain.enumeration.AttemptSyncState;
import com.codahale.metrics.annotation.Timed;
import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.service.AttemptService;
import cc.officina.gatorade.web.rest.util.HeaderUtil;
import cc.officina.gatorade.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Attempt.
 */
@RestController
@RequestMapping("/api")
public class AttemptResource {

    private final Logger log = LoggerFactory.getLogger(AttemptResource.class);

    private static final String ENTITY_NAME = "attempt";

    private final AttemptService attemptService;

    public AttemptResource(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    /**
     * POST  /attempts : Create a new attempt.
     *
     * @param attempt the attempt to create
     * @return the ResponseEntity with status 201 (Created) and with body the new attempt, or with status 400 (Bad Request) if the attempt has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/attempts")
    @Timed
    public ResponseEntity<Attempt> createAttempt(@RequestBody Attempt attempt) throws URISyntaxException {
        log.debug("REST request to save Attempt : {}", attempt);
        if (attempt.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new attempt cannot already have an ID")).body(null);
        }
        Attempt result = attemptService.save(attempt);
        return ResponseEntity.created(new URI("/api/attempts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /attempts : Updates an existing attempt.
     *
     * @param attempt the attempt to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated attempt,
     * or with status 400 (Bad Request) if the attempt is not valid,
     * or with status 500 (Internal Server Error) if the attempt couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/attempts")
    @Timed
    public ResponseEntity<Attempt> updateAttempt(@RequestBody Attempt attempt) throws URISyntaxException {
        log.debug("REST request to update Attempt : {}", attempt);
        if (attempt.getId() == null) {
            return createAttempt(attempt);
        }
        Attempt result = attemptService.save(attempt);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, attempt.getId().toString()))
            .body(result);
    }

    /**
     * GET  /attempts : get all the attempts.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of attempts in body
     */
    @GetMapping("/attempts")
    @Timed
    public ResponseEntity<List<Attempt>> getAllAttempts(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Attempts");
        Page<Attempt> page = attemptService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/attempts");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /attempts/:id : get the "id" attempt.
     *
     * @param id the id of the attempt to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the attempt, or with status 404 (Not Found)
     */
    @GetMapping("/attempts/{id}")
    @Timed
    public ResponseEntity<Attempt> getAttempt(@PathVariable Long id) {
        log.debug("REST request to get Attempt : {}", id);
        Attempt attempt = attemptService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(attempt));
    }

    /**
     * DELETE  /attempts/:id : delete the "id" attempt.
     *
     * @param id the id of the attempt to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/attempts/{id}")
    @Timed
    public ResponseEntity<Void> deleteAttempt(@PathVariable Long id) {
        log.debug("REST request to delete Attempt : {}", id);
        attemptService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/attempts/sync")
    @Timed
    public ResponseEntity<Void> syncAttempts(@RequestBody Request request){
        if (request.getOfflineAttempts() != null && request.getOfflineAttempts().size() > 0){
            //controllo l'attributo sync degli attempts
            Match match = request.getMatch();
            int notSyncCount = 0, syncCount = 0, syncedOnEndMatchCount = 0;
            Attempt serverAttempt;
            for (Attempt attempt : request.getOfflineAttempts()){
                switch (attempt.getSync()){
                    case sync:
                        //client e server sono allineati
                        //skippo
                        syncCount++;
                        //attemptService.syncAttempt(attempt, match, AttemptSyncState.sync);
                        break;
                    case syncOnEndMatch:
                        attemptService.syncAttempt(attempt, match, AttemptSyncState.syncOnEndMatch);
                        syncedOnEndMatchCount++;
                        break;
                    default:
                        //case notSync:
                        //valore di default, se "sync" è nullo o notSync
                        serverAttempt = attemptService.syncAttempt(attempt, match,AttemptSyncState.syncOnEndMatch);
                        if (serverAttempt.getStopAttempt() == null){
                            serverAttempt.setStopAttempt(ZonedDateTime.now());
                        }
                        serverAttempt.setCompleted(true);
                        notSyncCount++;
                        attemptService.save(serverAttempt);
                        break;
                }
            }
            //synced from client = sincati dal client quando viene fatto l'end attempt online
            //Attempts not synced = attempts che sono stati chiusi offline, o non sono stati chiusi.
            //Attempts synced at end match = attempts che sono stati aggiornati lato server. tutti quelli che arrivano con stato notSync.
            log.info("Match id: "+match.getId()+" Total attempts: "+match.getAttempts().size()+" - Attempts synced from client: "+syncCount+" - Attempts not synced: "+notSyncCount+" - Attempts synced at end match: "+syncedOnEndMatchCount);
        }else{
            log.info("No offline attempt to sync");
        }
        return ResponseEntity.ok(null);
    }
}
