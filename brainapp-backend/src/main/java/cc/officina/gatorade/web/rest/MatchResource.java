package cc.officina.gatorade.web.rest;

import cc.officina.gatorade.domain.*;
import cc.officina.gatorade.service.AttemptService;
import cc.officina.gatorade.service.dto.MatchDTO;
import com.codahale.metrics.annotation.Timed;
import cc.officina.gatorade.domain.enumeration.ReportType;
import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.MatchService;
import cc.officina.gatorade.service.ReportService;
import cc.officina.gatorade.web.rest.util.HeaderUtil;
import cc.officina.gatorade.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sun.rmi.runtime.Log;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.*;

/**
 * REST controller for managing Match.
 */
@RestController
@RequestMapping("/api")
public class MatchResource {

    private final Logger log = LoggerFactory.getLogger(MatchResource.class);

    private static final String ENTITY_NAME = "match";

    private final MatchService matchService;
    private final GamificationService gamificationService;
    private final ReportService reportService;
    private final AttemptService attemptService;

    public MatchResource(MatchService matchService, GamificationService gamificationService, ReportService reportService, AttemptService attemptService) {
        this.matchService = matchService;
        this.gamificationService = gamificationService;
        this.reportService = reportService;
        this.attemptService = attemptService;
    }

    /**
     * POST  /matches : Create a new match.
     *
     * @param match the match to create
     * @return the ResponseEntity with status 201 (Created) and with body the new match, or with status 400 (Bad Request) if the match has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/matches")
    @Timed
    public ResponseEntity<Match> createMatch(@RequestBody Match match) throws URISyntaxException {
        log.debug("REST request to save Match : {}", match);
        if (match.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new match cannot already have an ID")).body(null);
        }
        Match result = matchService.save(match);
        return ResponseEntity.created(new URI("/api/matches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /matches : Updates an existing match.
     *
     * @param match the match to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated match,
     * or with status 400 (Bad Request) if the match is not valid,
     * or with status 500 (Internal Server Error) if the match couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/matches")
    @Timed
    public ResponseEntity<Match> updateMatch(@RequestBody Match match) throws URISyntaxException {
        log.debug("REST request to update Match : {}", match);
        if (match.getId() == null) {
            return createMatch(match);
        }
        Match result = matchService.save(match);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, match.getId().toString()))
            .body(result);
    }

    /**
     * GET  /matches : get all the matches.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of matches in body
     */
    @GetMapping("/matches")
    @Timed
    public ResponseEntity<List<Match>> getAllMatches(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Matches");
        Page<Match> page = matchService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/matches");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /matches/:id : get the "id" match.
     *
     * @param id the id of the match to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the match, or with status 404 (Not Found)
     */
    @GetMapping("/matches/{id}")
    @Timed
    public ResponseEntity<Match> getMatch(@PathVariable Long id) {
        log.debug("REST request to get Match : {}", id);
        Match match = matchService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(match));
    }

    /**
     * DELETE  /matches/:id : delete the "id" match.
     *
     * @param id the id of the match to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/matches/{id}")
    @Timed
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        log.debug("REST request to delete Match : {}", id);
        matchService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PutMapping("/matches/{id}/reset")
    @Timed
    @Transactional
    public ResponseEntity<Match> resetMatch(@PathVariable Long id) throws URISyntaxException {
        log.info("REST request to reset Match with id " + id);
        Match match = matchService.findOne(id);
        if (match == null) {
            return new ResponseEntity<>(null, null, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, match.getId().toString()))
            .body(matchService.resetMatch(match));
    }

    @PostMapping(value = "/matches/{id}/report/{userid}", consumes = {MediaType.APPLICATION_JSON_VALUE})
    @Timed
    public ResponseEntity<Match> matchReport(@PathVariable Long id, @PathVariable String userid, @RequestBody ReportRequest request) throws URISyntaxException {
        Report report = new Report();
        log.info("END MATCH - INIZIO REPORT userid = " + userid + " - match_id = " + id);
        log.info(request.toString());
        log.info("END MATCH - FINE REPORT userid = " + userid + " - match_id = " + id);
        report = reportService.matchReport(id, userid, request);
        if (report == null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "nullinfo", "Cannot create report, missing info")).body(null);
        }else{
            return ResponseEntity.ok().build();
        }
    }

    @PostMapping(value = "/matches/{id}/error/{userid}", consumes = {MediaType.APPLICATION_JSON_VALUE})
    @Timed
    public ResponseEntity<Match> matchError(@PathVariable Long id, @PathVariable String userid, @RequestBody ReportRequest request) throws URISyntaxException {
        Report report = new Report();
        log.info("INIZIO ERROR userid = " + userid + " - match_id = " + id);
        log.info(request.toString());
        log.info("FINE ERROR userid = " + userid + " - match_id = " + id);
        report = reportService.matchError(id, userid, request);
        if (report == null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "nullinfo", "Cannot create report, missing info")).body(null);
        }else{
            return ResponseEntity.ok().build();
        }
    }

    @DeleteMapping("/player-activities/user/{userId}")
    @Timed
    public ResponseEntity<Void> deletePlayerActivities(@PathVariable String userId) {
        log.debug("REST request to delete player activities: {}", userId);
        matchService.deletePlayerActivities(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/matches/start-batch")
    @Timed
    public ResponseEntity<Void> startBatch() throws URISyntaxException {
        log.info("REST request to start batch");
        matchService.matchesRestore();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/matches/by-session/{sessionId}")
    public ResponseEntity<List<Match>> getMatchesBySessionId(@PathVariable Long sessionId){
        log.debug("REST request to get a page of Matches by Session id");
        return ResponseEntity.ok(matchService.findValidBySessionId(sessionId));
    }

    @PutMapping("/matches/outcome-drainage")
    @Timed
    @Transactional
    public ResponseEntity<Void> startOutcomeDrainage() throws URISyntaxException {
        log.info("REST request to matches outcome drainage");
        Page<Match> matches = matchService.findAll(new PageRequest(0, Integer.MAX_VALUE));
        for (Match match : matches){
            String score;
            switch (match.getGame().getType()){
                case MINPOINT:
                    score = match.getMinScore();
                    if (score != null){
                        match.setBestScore(Long.parseLong(score));
                    }
                    break;
                case POINT:
                    score = match.getMaxScore();
                    if (score != null){
                        match.setBestScore(Long.parseLong(score));
                    }
                    break;
                case LEVEL:
                    match.setBestLevel(match.getMaxLevel());
                    break;

            }
            matchService.save(match);
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/matches/{id}/admin/elaborate")
    @Timed
    @Transactional
    public ResponseEntity<Match> adminElaborateMatch(@PathVariable Long id) throws URISyntaxException {
        log.info("REST request to admin elaborate match with id: "+ id);
        Match match = matchService.findOne(id);
        if (match == null){
            log.info("Match with id: "+ id+" not found");
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(matchService.adminElaborateMatch(match));
    }

    @PutMapping("/matches/{id}/admin/close")
    @Timed
    @Transactional
    public ResponseEntity<Match> adminCloseMatch(@PathVariable Long id) throws URISyntaxException {
        log.info("REST request to admin close match with id: "+ id);
        Match match = matchService.findOne(id);
        if (match == null){
            log.info("Match with id: "+ id+" not found");
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(matchService.adminCloseMatch(match));
    }

    @PutMapping("/matches/reset-pending")
    @Timed
    @Transactional
    public ResponseEntity<Match> resetPendingMatch(@RequestBody Request request){
        log.info("REST request to reset pending match for player: "+ request.getPlayerid()+" on session with id "+request.getSessionid());
        Match match = matchService.restartMatch(request.getSessionid(), request.getPlayerid());
        if (match == null) {
            log.info("No restartable match found for user: "+request.getPlayerid()+" on session: "+request.getSessionid());
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok().body(match);
    }

    @PutMapping("/matches/complete-pending")
    @Timed
    @Transactional
    public ResponseEntity<Match> completePendingMatch(@RequestBody Request request){
        log.info("REST request to complete pending match for player: "+ request.getPlayerid()+" on session with id "+request.getSessionid());
        Match match = matchService.completeMatch(request.getSessionid(), request.getPlayerid());
        if (match == null) {
            log.info("No restartable match found for user: "+request.getPlayerid()+" on session: "+request.getSessionid());
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok().body(match);
    }
}
