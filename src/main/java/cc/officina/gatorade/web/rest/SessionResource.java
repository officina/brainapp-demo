package cc.officina.gatorade.web.rest;

import com.codahale.metrics.annotation.Timed;

import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.service.GameService;
import cc.officina.gatorade.service.SessionService;
import cc.officina.gatorade.service.dto.SessionDTO;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.StringTokenizer;

/**
 * REST controller for managing Session.
 */
@RestController
@RequestMapping("/api")
public class SessionResource {

    private final Logger log = LoggerFactory.getLogger(SessionResource.class);

    private static final String ENTITY_NAME = "session";

    private final SessionService sessionService;
    private final GameService gameService;

    public SessionResource(SessionService sessionService, GameService gameService) {
        this.sessionService = sessionService;
        this.gameService = gameService;
    }

    /**
     * POST  /sessions : Create a new session.
     *
     * @param session the session to create
     * @return the ResponseEntity with status 201 (Created) and with body the new session, or with status 400 (Bad Request) if the session has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sessions")
    @Timed
    public ResponseEntity<Session> createSession(@RequestBody Session session) throws URISyntaxException {
        log.info("REST request to save Session : {}", session);
        if (session.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new session cannot already have an ID")).body(null);
        }
        //VALIDATION!
        Game game = gameService.findOne(session.getGame().getId());
        if(game == null) {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidGameId", "Invalid game id")).body(null);
        }
        Session oldSession = sessionService.findOneByExtId(session.getExtId());
        if(oldSession != null)
        {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidExtId", "extId already used")).body(null);
        }
        Session result = sessionService.saveAndSchedule(session.getGame(), session);
        return ResponseEntity.created(new URI("/api/sessions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sessions : Updates an existing session.
     *
     * @param session the session to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated session,
     * or with status 400 (Bad Request) if the session is not valid,
     * or with status 500 (Internal Server Error) if the session couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sessions")
    @Timed
    public ResponseEntity<Session> updateSession(@RequestBody Session session) throws URISyntaxException {
        log.debug("REST request to update Session : {}", session);
        if (session.getId() == null) {
            return createSession(session);
        }
        //VALIDATION
        Session _session = sessionService.findOne(session.getId());
        if(session.getMatches() != null && session.getMatches().size() > 0)
        {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "sessionAlreadyInUse", "Session already in use")).body(null);
        }
        Game game = gameService.findOne(session.getGame().getId());
        if(game == null) {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidGameId", "Invalid game id")).body(null);
        }
        Session oldSession = sessionService.findOneByExtId(session.getExtId());
        if(oldSession != null && !oldSession.getId().equals(session.getId()))
        {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidExtId", "extId already used")).body(null);
        }
        Session result = sessionService.save(session);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, session.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sessions : get all the sessions.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sessions in body
     */
    @GetMapping("/sessions")
    @Timed
    public ResponseEntity<List<Session>> getAllSessions(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Sessions");
        Page<Session> page = sessionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sessions");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sessions/:id : get the "id" session.
     *
     * @param id the id of the session to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the session, or with status 404 (Not Found)
     */
    @GetMapping("/sessions/{id}")
    @Timed
    public ResponseEntity<Session> getSession(@PathVariable Long id) {
        log.debug("REST request to get Session : {}", id);
        Session session = sessionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(session));
    }

    /**
     * DELETE  /sessions/:id : delete the "id" session.
     *
     * @param id the id of the session to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sessions/{id}")
    @Timed
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        log.debug("REST request to delete Session : {}", id);
        //VALIDATION
        Session session = sessionService.findOne(id);
        if(session.getMatches() != null && session.getMatches().size() > 0)
        {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "sessionAlreadyInUse", "Session already in use")).body(null);
        }
        sessionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/sessions/elaborate/{id}")
    @Timed
    @Transactional
    public ResponseEntity<Session> elaborateSession(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to elaborate Session with id " + id);
        Session session = sessionService.findOne(id);
        if (session == null || session.getId() == null) {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("notFound", "SessionNotFound", "Session not found")).body(null);
        }
        if(session.isElaborated())
        {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("alreadyElaborated", "SessionAlreadyElab", "Session already processed")).body(null);
        }
        sessionService.elaborate(session);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, session.getId().toString()))
            .body(null);
    }

    @PutMapping("/sessions/ri-elaborate/{id}")
    @Timed
    @Transactional
    public ResponseEntity<Session> riElaborateSession(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to ri-elaborate Session with id " + id);
        // questo metodo elabora la sessione inviando i match con "used_to_po" uguale a true
        Session session = sessionService.findOne(id);
        if (session == null || session.getId() == null) {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("notFound", "SessionNotFound", "Session not found")).body(null);
        }
        //elabora anche sessioni con il flag "Elaborate" a true
        sessionService.rielaborate(session);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, session.getId().toString()))
            .body(null);
    }

    @GetMapping("/sessions/user/{userId}/labs/{labs}")
    @Timed
    public ResponseEntity<List<SessionDTO>> getUserLabsSession(@PathVariable String userId, @PathVariable String labs) {
        log.debug("REST request to get Sessions for user " + userId + " and labs " + labs);
        List<SessionDTO> sessionDTOs = sessionService.getUserLabsSession(userId, Arrays.asList(labs.split("\\s*,\\s*")));
        return new ResponseEntity<>(sessionDTOs, null, HttpStatus.OK);
    }

    @GetMapping("/sessions/by-lab/{id}")
    @Timed
    @Transactional
    public ResponseEntity<List<Session>> getSessionsByLab(@PathVariable String id) {
        log.debug("REST request active Sessions for Lab with id "+ id);
        List<Session> sessions = sessionService.findAllByLabId(id);
        return ResponseEntity.ok()
            .body(sessions);
    }
}
