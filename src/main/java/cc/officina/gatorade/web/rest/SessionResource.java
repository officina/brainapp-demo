package cc.officina.gatorade.web.rest;

import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.service.MatchService;
import com.codahale.metrics.annotation.Timed;

import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.service.GameService;
import cc.officina.gatorade.service.SessionService;
import cc.officina.gatorade.service.dto.SessionDTO;
import cc.officina.gatorade.web.rest.util.HeaderUtil;
import cc.officina.gatorade.web.rest.util.PaginationUtil;
import com.sun.org.apache.xpath.internal.operations.Bool;
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
import java.util.*;

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
    private final MatchService matchService;

    public SessionResource(SessionService sessionService, GameService gameService, MatchService matchService) {
        this.sessionService = sessionService;
        this.gameService = gameService;
        this.matchService = matchService;
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
        session.setGame(game);
        if (session.getId() != null){
            Session oldSession = sessionService.findOne(session.getId());
            if(oldSession != null)
            {
                return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidId", "id already used")).body(null);
            }
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
    @Transactional
    public ResponseEntity<Session> updateSession(@RequestBody Session session) throws URISyntaxException {
        log.debug("REST request to update Session : {}", session);
        if (session.getId() == null) {
            return createSession(session);
        }
        //VALIDATION
        if(session.getMatches() != null && session.getMatches().size() > 0)
        {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "sessionAlreadyInUse", "Session already in use")).body(null);
        }
        Game game = gameService.findOne(session.getGame().getId());
        if(game == null) {
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidGameId", "Invalid game id")).body(null);
        }
        Session oldSession = sessionService.findOne(session.getId());
        if(oldSession != null)
        {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidId", "id already used")).body(null);
        }
        Session result = sessionService.save(session);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, session.getId().toString()))
            .body(result);
    }

    @PutMapping("/sessions/{id}")
    @Timed
    @Transactional
    public ResponseEntity<Session> updateSessionRemote(@PathVariable Long id, @RequestBody Session session) throws URISyntaxException {

        log.debug("REST request to update Session : {}", session);

        //VALIDATION
        if (id == null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("notFound", "SessionNotFound", "Invalid id")).body(null);
        }
        Session _session = sessionService.findOne(id);
        if (_session == null){
            log.error("Unable to update. Session with id {} not found.", id);
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("notFound", "SessionNotFound", "Session not found")).body(null);
        }

        //Se ho già dei match giocati la sessione è in uso
        if(_session.getMatches() != null && _session.getMatches().size() > 0)
        {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "sessionAlreadyInUse", "Session already in use")).body(null);
        }


        if (session.getGame() == null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "missingGameId", "Missing the Game in the body request")).body(null);
        }
        Game game = gameService.findOne(session.getGame().getId());
        if(game == null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidGameId", "Invalid game id")).body(null);
        }
        session.setGame(game);
        Session oldSession = sessionService.findOne(session.getId());
        if(oldSession != null && !oldSession.getId().equals(session.getId()))
        {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "invalidId", "id already used")).body(null);
        }

        //il flag elaborated viene modificato solo dal metodo SessionResource.elaborateSession()
        session.setElaborated(_session.isElaborated());
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
    @Transactional
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        log.debug("REST request to delete Session : {}", id);
        //VALIDATION
        Session session = sessionService.findOne(id);
        if (session == null){
            log.error("Unable to update. Session with id {} not found.", id);
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("notFound", "SessionNotFound", "Session not found")).body(null);
        }
        List<Match> matches = matchService.findValidBySessionId(session.getId());
        if(matches != null && matches.size() > 0)
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
    public ResponseEntity<List<SessionDTO>> getUserLabsSession(@PathVariable String userId, @PathVariable String labs, @RequestParam(value = "active", required = false)Boolean active) {
        log.debug("REST request to get Sessions for user " + userId + " and labs " + labs);
        //TODO aggiungere controlli su validità stringa
        List<SessionDTO> sessionDTOs = sessionService.getUserLabsSession(userId, Arrays.asList(labs.split("\\s*,\\s*")), active);
        return new ResponseEntity<>(sessionDTOs, null, HttpStatus.OK);
    }

    @GetMapping("/sessions/labs/{labs}")
    @Timed
    @Transactional
    public ResponseEntity<List<SessionDTO>> getSessionsByLab(@PathVariable String labs, @RequestParam(value = "active", required = false)Boolean active) {
        log.debug("REST request active Sessions for Labs with ids "+ labs);
        //TODO aggiungere controlli su validità stringa
        List<Session> sessions = sessionService.getSessionsByLabs(Arrays.asList(labs.split("\\s*,\\s*")), active);
        List<SessionDTO> sessionDtos = sessionService.mapSessionsToDTOS(sessions);
        return ResponseEntity.ok()
            .body(sessionDtos);
    }

    @GetMapping("/sessions/user/{userId}")
    @Timed
    @Transactional
    public ResponseEntity<List<SessionDTO>> getSessionsByUser(@PathVariable String userId, @RequestParam(value = "active", required = false)Boolean active) {
        log.debug("REST request active Sessions for User with id "+ userId);
        List<Session> sessions = sessionService.findAllByUserId(userId, active);
        List<SessionDTO> sessionDtos = sessionService.mapSessionsToDTOS(sessions);
        sessionDtos = sessionService.setValidMatchToSessionDtos(userId, sessionDtos);
        return ResponseEntity.ok()
            .body(sessionDtos);
    }
}
