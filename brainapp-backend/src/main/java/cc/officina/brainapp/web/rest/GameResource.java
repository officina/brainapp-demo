package cc.officina.brainapp.web.rest;

import cc.playoff.sdk.PlayOff;
import cc.playoff.sdk.PlayOff.PlayOffException;

import com.codahale.metrics.annotation.Timed;

import cc.officina.brainapp.domain.Attempt;
import cc.officina.brainapp.domain.Game;
import cc.officina.brainapp.domain.Match;
import cc.officina.brainapp.domain.MatchTemplate;
import cc.officina.brainapp.domain.Request;
import cc.officina.brainapp.domain.Session;
import cc.officina.brainapp.service.AttemptService;
import cc.officina.brainapp.service.GameService;
import cc.officina.brainapp.service.GamificationService;
import cc.officina.brainapp.service.MatchService;
import cc.officina.brainapp.service.MatchTemplateService;
import cc.officina.brainapp.service.SessionService;
import cc.officina.brainapp.web.response.AttemptResponse;
import cc.officina.brainapp.web.response.MatchResponse;
import cc.officina.brainapp.web.rest.util.HeaderUtil;
import cc.officina.brainapp.web.rest.util.PaginationUtil;
import com.google.gson.Gson;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Game.
 */
@RestController
@RequestMapping("/api")
public class GameResource {

    private final Logger log = LoggerFactory.getLogger(GameResource.class);

    private static final String ENTITY_NAME = "game";

    private final GameService gameService;
    private final MatchService matchService;
    private final AttemptService attemptService;
    private final MatchTemplateService templateService;
    private final SessionService sessionService;
    private final GamificationService gamificationService;
    @Value("${playoff.client.id}")
    private String poClientId;
	@Value("${playoff.client.secret}")
    private String poClientSecret;
	@Value("${playoff.client.domain}")
    private String poDomain;

    public GameResource(GameService gameService, MatchService matchService, AttemptService attemptService, MatchTemplateService templateService, SessionService sessionService,
    				GamificationService gamificationService) {
        this.gameService = gameService;
        this.matchService = matchService;
        this.attemptService = attemptService;
        this.templateService = templateService;
        this.sessionService = sessionService;
        this.gamificationService = gamificationService;
    }

    /**
     * POST  /games : Create a new game.
     *
     * @param game the game to create
     * @return the ResponseEntity with status 201 (Created) and with body the new game, or with status 400 (Bad Request) if the game has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/games")
    @Timed
    public ResponseEntity<Game> createGame(@RequestBody Game game) throws URISyntaxException {
        log.debug("REST request to save Game : {}", game);
        if (game.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new game cannot already have an ID")).body(null);
        }
        Game result = gameService.save(game);
        return ResponseEntity.created(new URI("/api/games/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /games : Updates an existing game.
     *
     * @param game the game to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated game,
     * or with status 400 (Bad Request) if the game is not valid,
     * or with status 500 (Internal Server Error) if the game couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/games")
    @Timed
    public ResponseEntity<Game> updateGame(@RequestBody Game game) throws URISyntaxException {
        log.debug("REST request to update Game : {}", game);
        if (game.getId() == null) {
            return createGame(game);
        }
        Game result = gameService.save(game);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, game.getId().toString()))
            .body(result);
    }

    /**
     * GET  /games : get all the games.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of games in body
     */
    @GetMapping("/games")
    @Timed
    public ResponseEntity<List<Game>> getAllGames(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Games");
        Page<Game> page = gameService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/games");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /games/:id : get the "id" game.
     *
     * @param id the id of the game to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the game, or with status 404 (Not Found)
     */
    @GetMapping("/games/{id}")
    @Timed
    public ResponseEntity<Game> getGame(@PathVariable Long id) {
        log.debug("REST request to get Game : {}", id);
        Game game = gameService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(game));
    }

    @GetMapping("/play/{id}/init/{extid}/{playerid}")
    @Timed
    public ResponseEntity<Game> getGameInit(@PathVariable Long id, @PathVariable String extid, @PathVariable String playerid) {
        log.info("REST game init for game with id = " + id + ", extId = " + extid + " and playerid = " + playerid);
        Game game = gameService.findOne(id);
        if(game == null)
        {
        	log.info("Session not valid - game not found");
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("game", "gameNotFound", "Game with id "+ id + " not found")).body(null);
        }
        MatchTemplate template = templateService.findOneByGameId(id);
        if(template == null)
        {
        	log.info("Session not valid - not template found for game with id " + id);
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("template", "templateNotFound", "No template founded for game with id "+ id)).body(null);
        }
        boolean validateSession = sessionService.validateSessionAndUser(extid, playerid, id);
        if(! validateSession)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "invalidSession", "Session with ext_id " + extid + " is invalid.")).body(null);
        return new ResponseEntity<>(game, null, HttpStatus.OK);
    }

    @DeleteMapping("/games/{id}")
    @Timed
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        log.debug("REST request to delete Game : {}", id);
        gameService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/play")
    @Timed
    public ResponseEntity<MatchResponse> startMatch(@RequestBody Request request) {

    	if(request.getGameid() == null || request.getPlayerid() == null)
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("body", "MalformedBody", "Malformed body")).body(null);
        log.info("REST request to startMatch : {}", request.getGameid());
        Session session = sessionService.findOneByExtId(request.getSessionid());//TODO: aggiunta della valiudità temporale della sessione chiamata
        if(session == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionNotFound", "Session with id "+ request.getSessionid() + " not found")).body(null);

        Game game = gameService.findOne(request.getGameid());
        if(game == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("game", "gameNotFound", "Game with id "+ request.getGameid() + " not found")).body(null);

        MatchTemplate template = templateService.findOneByGameId(request.getGameid());
        if(template == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("template", "templateNotFound", "Template for game with id "+ request.getGameid() + " not found")).body(null);
        // non passo per ora il matchToken, o meglio passo -1
        return new ResponseEntity<>(gameService.startMatch(game, template, request.getPlayerid(), session, -1l), null, HttpStatus.OK);
    }

    @PostMapping("/play/attempt")
    @Timed
    @Transactional
    public ResponseEntity<AttemptResponse> startAttempt(@RequestBody Request request) {
    	if(request.getGameid() == null || request.getPlayerid() == null || request.getSessionid() == null)
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("body", "MalformedBody2", "Malformed body")).body(null);
        log.info("REST request to startAttempt for game " + request.getGameid() + " and match with id " + request.getMatchid());
        Game game = gameService.findOne(request.getGameid());
        if(game == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("game", "gameNotFound", "Game with id "+request.getGameid() + " not found")).body(null);

        MatchTemplate template = templateService.findOneByGameId(request.getGameid());
        if(template == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("template", "templateNotFound", "Template for game with id "+ request.getGameid() + " not found")).body(null);

        Session session = sessionService.findOneByExtId(request.getSessionid());
        if(session == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionNotFound", "Session with id "+ request.getSessionid() + " not found")).body(null);

        Match match = null;
        if(request.getMatchid() != null)
        	match = matchService.findOne(request.getMatchid());
        if(match == null)
        {
        	match = gameService.startMatch(game, template, request.getPlayerid(),session, request.getMatchtoken()).getMatch();
        }
        else
        {
        	if((!match.getMatchToken().equals(request.getMatchtoken())) && match.getMatchToken() > -1)
        	{
        		return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);
        	}
        	else
        	{
        		match.setMatchToken(request.getMatchtoken());
        		matchService.save(match);
        	}
        }
        match.getAttempts().size();
        return new ResponseEntity<>(gameService.startAttempt(game, match), null, HttpStatus.OK);
    }

    @PutMapping("/play/attempt/score")
    @Timed
    @Transactional
	public ResponseEntity<AttemptResponse> updateAttemptScore(@RequestBody Request request) {
    	if(request.getGameid() == null || request.getPlayerid() == null || request.getAttemptid() == null)
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("body", "MalformedBody", "Malformed body")).body(null);
    	log.info("REST request to update score for game Game with id " + request.getGameid()+", attempt " + request.getAttemptid());
    	log.info("Score: " + request.getScore() + " - Level: " + request.getLevel());

    	Attempt attempt = attemptService.findOne(request.getAttemptid());

        if(!attempt.getMatch().getMatchToken().equals(request.getMatchtoken()))
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);

        if(attempt == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("attempt", "attemptNotFound", "Attempt with id "+request.getAttemptid() + " not found")).body(null);
        return new ResponseEntity<>(gameService.updateAttemptScore(attempt.getMatch().getGame(), attempt, new Long(request.getScore()), request.getLevel()), null, HttpStatus.OK);
    }

    @PutMapping("/play/attempt/end")
    @Timed
    @Transactional
    public ResponseEntity<MatchResponse> stopAttempt(@RequestBody Request request) {
    	if(request.getAttemptid() == null)
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("body", "MalformedBody", "Malformed body")).body(null);
    	log.info("REST request to end attemtp for game Game with id " + request.getGameid()+", attempt " + request.getAttemptid());
    	log.info("Score: " + request.getScore() + " - Level: " + request.getLevel());
        Attempt attempt = attemptService.findOne(request.getAttemptid());
        if(attempt == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("attempt", "attemptNotFound", "Attempt with id "+request.getAttemptid() + " not found")).body(null);

        if(!attempt.getMatch().getMatchToken().equals(request.getMatchtoken()))
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);

        attempt.getMatch().getAttempts().size();
        return new ResponseEntity<>(gameService.stopAttempt(attempt.getMatch().getGame(), attempt, request.isCompleted(), request.getScore(), request.getLevel(), request.isEndmatch()), null, HttpStatus.OK);
    }

    @PutMapping("/play/end")
    @Timed
    @Transactional
    public ResponseEntity<MatchResponse> endMatch(@RequestBody Request request) {
    	if(request.getGameid() == null || request.getMatchid() == null)
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("body", "MalformedBody", "Malformed body")).body(null);
        log.info("REST request to finish match with id " + request.getMatchid() + " and game with id " + request.getGameid());
        log.info("Score (not validated): " + request.getScore() + " - Level (not validated): " + request.getLevel());
        if(request.getAttemptid() == null)
        	log.info("No attempt update");
        Match match = matchService.findOne(request.getMatchid());
        if(match == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchNotFound", "Match with id "+request.getMatchid() + " not found")).body(null);
        match.getAttempts().size();
        Attempt lastAttempt = null;
        if(request.getAttemptid() != null)
        	lastAttempt = attemptService.findOne(request.getAttemptid());

        if(!match.getMatchToken().equals(request.getMatchtoken()))
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);


        return new ResponseEntity<>(gameService.endMatch(match.getGame(), match, lastAttempt, new Long(request.getScore()), request.getLevel()), null, HttpStatus.OK);

    }

    @PutMapping("/play/restore-end")
    @Timed
    @Transactional
    public ResponseEntity<MatchResponse> endMatchRestore(@RequestBody Request request) {
    	if(request.getGameid() == null || request.getMatchid() == null)
			return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("body", "MalformedBody", "Malformed body")).body(null);
        log.info("REST request to finish match (RESTORE) with id " + request.getMatchid() + " and game with id " + request.getGameid());
        log.info("Score (not validated): " + request.getScore() + " - Level (not validated): " + request.getLevel());
        if(request.getAttemptid() == null)
        	log.info("No attempt update");
        Match match = matchService.findOne(request.getMatchid());
        if(match == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchNotFound", "Match with id "+request.getMatchid() + " not found")).body(null);
        match.getAttempts().size();
        Attempt lastAttempt = null;
        if(request.getAttemptid() != null)
        	lastAttempt = attemptService.findOne(request.getAttemptid());

        if(!match.getMatchToken().equals(request.getMatchtoken()))
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);


        return new ResponseEntity<>(gameService.endMatchRestore(match.getGame(), match, lastAttempt, new Long(request.getScore()), request.getLevel()), null, HttpStatus.OK);

    }

    @GetMapping("/games/leaderboards/{leaderboardid}")
    @Timed
    @CrossOrigin
    public ResponseEntity<Object> getLeaderboard(@PathVariable String leaderboardid, @RequestParam String userid){

        PlayOff pl = new PlayOff(poClientId,poClientSecret, null, "v2", poDomain);
        try {
            HashMap<String, String> query = new HashMap<String, String>();
            query.put("player_id", userid);
            query.put("detailed", "false");
            query.put("cycle", "alltime");
            query.put("sort", "descending");
            query.put("limit", "0");
            if(leaderboardid.indexOf("team_") > -1)
            	query.put("team_instance_id", "laboratorio_somma");
            Object response = pl.get("/runtime/leaderboards/"+leaderboardid, query);

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        }
    }
}
