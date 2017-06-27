package cc.officina.gatorade.web.rest;

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
}
