package cc.officina.gatorade.web.rest;

import cc.officina.gatorade.domain.enumeration.AttemptSyncState;
import cc.officina.gatorade.service.*;
import com.codahale.metrics.annotation.Timed;
import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;
import cc.officina.gatorade.domain.Request;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.web.response.AttemptResponse;
import cc.officina.gatorade.web.response.MatchResponse;
import cc.officina.gatorade.web.rest.util.HeaderUtil;
import cc.officina.gatorade.web.rest.util.PaginationUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Game.
 */
@RestController
@RequestMapping("/api")
public class GameResource {

    private final Logger log = LoggerFactory.getLogger(GameResource.class);
    private static final String USER_AGENT = "";
    private static final String ENTITY_NAME = "game";

    private final GameService gameService;
    private final MatchService matchService;
    private final AttemptService attemptService;
    private final MatchTemplateService templateService;
    private final SessionService sessionService;
    private final ReportService reportService;
    @Value("${validationService.endpoint}")
    private String replyEndPoint;
    @Value("${validationService.hostname}")
    private String hostname;
    @Value("${validationBypass}")
    private String bypass;

    public GameResource(GameService gameService, MatchService matchService, AttemptService attemptService, MatchTemplateService templateService, SessionService sessionService,
    				ReportService reportService) {
        this.gameService = gameService;
        this.matchService = matchService;
        this.attemptService = attemptService;
        this.templateService = templateService;
        this.sessionService = sessionService;
        this.reportService = reportService;
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

    @GetMapping("/play/{id}/init/{sessionId}/{playerid}")
    @Timed
    public ResponseEntity<Game> getGameInit(@PathVariable Long id, @PathVariable Long sessionId, @PathVariable String playerid, @RequestParam("bp") String bp) {
        log.info("REST game init for game with id = " + id + ", session id = " + sessionId + " and playerid = " + playerid);
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
        if(sessionId == null)
        {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "missingSession", "Cannot execute GameInit with a null session id")).body(null);
        }
        Session session = sessionService.findOne(sessionId);
        if (session == null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "missingSession", "Session with id "+sessionId+" not found")).body(null);
        }
        boolean validateSession = false;
        if (bp != null && bp.matches(bypass)){
            validateSession = sessionService.validateSessionAndUser(sessionId, playerid, id);
        }else{
            String endpoint = replyEndPoint;//+"?idPlayer="+playerid+"&idSession="+sessionId+"&idTeam="+session.getPoRoot().split("_aggregate")[0]+"&idGame="+game.getId();
            String url = hostname+endpoint;

            HttpClient client = HttpClientBuilder.create().build();
            HttpGet request = new HttpGet(url);

            // add request header
            request.addHeader("User-Agent", USER_AGENT);
            HttpResponse response = null;

            try {
                log.info("Requiring validation through: "+url);
                response = client.execute(request);
                log.info("Risposta ottenuta: "+response);
                //log.info("StatusCode: "+response.getStatusLine().getStatusCode());
                if (response.getStatusLine().getStatusCode() == 200){
                    BufferedReader rd = new BufferedReader(
                        new InputStreamReader(response.getEntity().getContent()));

                    StringBuffer result = new StringBuffer();
                    String line = "";
                    while ((line = rd.readLine()) != null) {
                        result.append(line);
                    }
                    log.info("Session valid - validation service complete with "+ result);
                    JsonNode responseJson = new ObjectMapper().readTree(result.toString()).get("Authorized");
                    if (responseJson.booleanValue()){
                        validateSession = sessionService.validateSessionAndUser(sessionId, playerid, id);
                    }
                }else{
                    log.info("Session not valid - validation service failed. status code: "+ response.getStatusLine().getStatusCode());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        if(!validateSession)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "invalidSession", "Session with session id " + sessionId + " is invalid.")).body(null);
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
        log.info("REST request to startMatch : {} , replay: "+request.isReplay(), request.getGameid());
        if (request.getSessionid() == null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "missingSession", "Cannot execute StartMatch with a null session id")).body(null);
        }
        Session session = sessionService.findOne(request.getSessionid());//TODO: aggiunta della valiudità temporale della sessione chiamata
        if(session == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionNotFound", "Session with id "+ request.getSessionid() + " not found")).body(null);

        Game game = gameService.findOne(request.getGameid());
        if(game == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("game", "gameNotFound", "Game with id "+ request.getGameid() + " not found")).body(null);

        MatchTemplate template = templateService.findOneByGameId(request.getGameid());
        if(template == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("template", "templateNotFound", "Template for game with id "+ request.getGameid() + " not found")).body(null);
        MatchResponse response;

        if (session.getPoRoot() != null &&session.getPoRoot().startsWith("top_user_")){
            log.info("Request ti StartMatch for Top user: "+ request.getPlayerid()+" - session id: "+session.getId()+" - gameid: "+session.getGame().getId());
            response = gameService.replayMatch(game, template, request.getPlayerid(), session, -1l);
            if (response == null){
                return new ResponseEntity<>(gameService.startMatch(game, template, request.getPlayerid(), session, -1l), null, HttpStatus.OK);
            }
            return new ResponseEntity<>(response, null, HttpStatus.OK);
        }else{
            // non passo per ora il matchToken, o meglio passo -1
            if (request.isReplay()) {
                //ho il param replay a true.
                //procedo alla creazione del match
                response = gameService.replayMatch(game, template, request.getPlayerid(), session, -1l);
                if (response == null){
                    return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "Main match not found", "Match for game with id "+ request.getGameid() + " and user id "+request.getPlayerid()+" not found, cannot replay match")).body(null);
                }
            } else {
                //ho il param replay a false, provo a clonare, se non ho match di riferimento allora creo un nuovo match
                //procedo alla clonazione
                response = gameService.cloneMatch(game, template, request.getPlayerid(), session, -1l);
                if (response == null){
                    return new ResponseEntity<>(gameService.startMatch(game, template, request.getPlayerid(), session, -1l), null, HttpStatus.OK);
                }
            }
            return new ResponseEntity<>(response, null, HttpStatus.OK);
        }
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

        if (request.getSessionid() == null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "missingSession", "Cannot execute StartAttempt with a null session id")).body(null);
        }
        Session session = sessionService.findOne(request.getSessionid());
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
            if((!match.getMatchToken().equals(request.getMatchtoken())) && match.getMatchToken() > -1) {
        		return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);
        	}
        	else
        	{
                if (!match.isValid()){
                    return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchInvalid", "Match with id "+ match.getId() + " is invalid cannot continue")).body(null);
                }
                if (match.isElaborated()){
                    return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchElaborated", "Match with id "+ match.getId() + " already elaborated cannot continue")).body(null);
                }
                if (match.getStop() != null){
                    return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchEnded", "Match with id "+ match.getId() + " ended at "+match.getStop()+"  cannot continue")).body(null);
                }
                if (match.isAnomalous()){
                    return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchAnomalous", "Match with id "+ match.getId() + " registered as anomalous cannot continue")).body(null);
                }
                if (request.getMatchtoken() == null){
                    match.setAnomalous(true);
                    reportService.matchAnomalousToken(request.getMatchid(), request.getPlayerid(), match.toString());
                }else{
                    match.setMatchToken(request.getMatchtoken());
                }
        		matchService.save(match);
        	}
        }
        //match.getAttempts().size();
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

    @PutMapping("/v2/play/attempt/score")
    @Timed
    @Transactional
    public ResponseEntity<AttemptResponse> updateAttemptScoreV2(@RequestBody Request request) {
        log.info("REST request to update score for game Game with id " + request.getMatch().getGame().getId()+", attempt " + request.getAttempt().getId());
        log.info("Score: " + request.getScore() + " - Level: " + request.getLevel()+" - AttemptScore: "+request.getAttempt().getAttemptScore()+" - AttemptLevel: "+request.getAttempt().getLevelReached()) ;
        Attempt attempt = attemptService.syncAttempt(request.getAttempt(), request.getMatch(), request.getAttempt().getSync());

        Match match = attempt.getMatch();
        if(!match.getMatchToken().equals(request.getMatchtoken()))
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getMatch().getSession().getId() + " already in use")).body(null);
        if (!match.isValid()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchInvalid", "Match with id "+ match.getId() + " is invalid cannot continue")).body(null);
        }
        if (match.isElaborated()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchElaborated", "Match with id "+ match.getId() + " already elaborated cannot continue")).body(null);
        }
        if (match.getStop() != null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchEnded", "Match with id "+ match.getId() + " ended at "+match.getStop()+"  cannot continue")).body(null);
        }
        if (match.isAnomalous()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchAnomalous", "Match with id "+ match.getId() + " registered as anomalous cannot continue")).body(null);
        }

        return new ResponseEntity<>(gameService.updateAttemptScore(attempt.getMatch().getGame(), attempt, request.getAttempt().getAttemptScore(), request.getAttempt().getLevelReached()), null, HttpStatus.OK);
    }

    @PutMapping("/play/attempt/end")
    @Timed
    @Transactional
    public ResponseEntity<MatchResponse> stopAttempt(@RequestBody Request request) {
    	log.info("REST request to end attemtp for game Game with id " + request.getGameid()+", attempt " + (request.getAttemptid() != null ? request.getAttemptid() : "created offline with localId: "+request.getLocalid()));
    	log.info("Score: " + request.getScore() + " - Level: " + request.getLevel());
        Attempt attempt = attemptService.syncAttempt(request.getAttempt(), request.getMatch(), request.getAttempt().getSync());

        if(attempt == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("attempt", "attemptNotFound", "Attempt with id "+request.getAttemptid() + " not found")).body(null);

        Match match = attempt.getMatch();
        if(!match.getMatchToken().equals(request.getMatchtoken()))
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);
        if (!match.isValid()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchInvalid", "Match with id "+ match.getId() + " is invalid cannot continue")).body(null);
        }
        if (match.isElaborated()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchElaborated", "Match with id "+ match.getId() + " already elaborated cannot continue")).body(null);
        }
        if (match.getStop() != null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchEnded", "Match with id "+ match.getId() + " ended at "+match.getStop()+"  cannot continue")).body(null);
        }
        if (match.isAnomalous()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchAnomalous", "Match with id "+ match.getId() + " registered as anomalous cannot continue")).body(null);
        }

        attempt.getMatch().getAttempts().size();
        return new ResponseEntity<>(gameService.stopAttempt(attempt.getMatch().getGame(), attempt, request.isCompleted(), request.getScore(), request.getLevel(), request.isEndmatch()), null, HttpStatus.OK);
    }

    @PutMapping("/play/attempt/restart")
    @Timed
    @Transactional
    public ResponseEntity<MatchResponse> restartAttempt(@RequestBody Request request) {
        log.info("REST request to restart attemtp for game Game with id " + request.getGameid()+", attempt " + (request.getAttempt().getId() != null ? request.getAttempt().getId() : "created offline with localId: "+request.getAttempt().getLocalId()));
        log.info("Score: " + request.getAttempt().getAttemptScore() + " - Level: " + request.getAttempt().getLevelReached());
        Attempt attempt = attemptService.syncAttempt(request.getAttempt(), request.getMatch(), request.getAttempt().getSync());

        if(attempt == null)
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("attempt", "attemptNotFound", "Attempt with id "+request.getAttemptid() + " not found")).body(null);

        Match match = attempt.getMatch();
        if(!match.getMatchToken().equals(request.getMatchtoken()))
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);
        if (!match.isValid()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchInvalid", "Match with id "+ match.getId() + " is invalid cannot continue")).body(null);
        }
        if (match.isElaborated()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchElaborated", "Match with id "+ match.getId() + " already elaborated cannot continue")).body(null);
        }
        if (match.getStop() != null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchEnded", "Match with id "+ match.getId() + " ended at "+match.getStop()+"  cannot continue")).body(null);
        }
        if (match.isAnomalous()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchAnomalous", "Match with id "+ match.getId() + " registered as anomalous cannot continue")).body(null);
        }
        //chiudo l'attempt
        MatchResponse response = gameService.stopAttempt(gameService.findOne(request.getGameid()), attempt, attempt.isCompleted(), attempt.getAttemptScore(), attempt.getLevelReached(), request.isEndmatch());

        //inizio un nuovo attempt
        return new ResponseEntity<>(gameService.startAttempt(response.getGame(), response.getMatch()), null, HttpStatus.OK);
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

        if(!match.getMatchToken().equals(request.getMatchtoken()))
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("session", "sessionAlreadyInUse", "Session with id "+ request.getSessionid() + " already in use")).body(null);
        if (!match.isValid()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchInvalid", "Match with id "+ match.getId() + " is invalid cannot continue")).body(null);
        }
        if (match.isElaborated()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchElaborated", "Match with id "+ match.getId() + " already elaborated cannot continue")).body(null);
        }
        if (match.getStop() != null){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchEnded", "Match with id "+ match.getId() + " ended at "+match.getStop()+"  cannot continue")).body(null);
        }
        if (match.isAnomalous()){
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchAnomalous", "Match with id "+ match.getId() + " registered as anomalous cannot continue")).body(null);
        }
        //ottengo la lista di attempt dal client
        Attempt serverAttempt;
        int notSyncCount = 0, syncCount = 0, syncedOnEndMatchCount = 0;

        if (request.getAttempts() != null && request.getAttempts().size() > 0){
            //controllo l'attributo sync degli attempts
            for (Attempt attempt : request.getAttempts()){
                switch (attempt.getSync()){
                    case sync:
                        //client e server sono allineati
                        //skippo
                        syncCount++;
                        //sinco lo stesso per allineare il flag. clientAttempt.sync = 1 mentre dbAttempt.sync = 0
                        attemptService.syncAttempt(attempt, match, AttemptSyncState.sync);
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
        }
        //synced from client = sincati dal client quando viene fatto l'end attempt online
        //Attempts not synced = attempts che sono stati chiusi offline, o non sono stati chiusi.
        //Attempts synced at end match = attempts che sono stati aggiornati lato server. tutti quelli che arrivano con stato notSync.
        log.info("Match id: "+match.getId()+" Total attempts: "+match.getAttempts().size()+" - Attempts synced from client: "+syncCount+" - Attempts not synced: "+notSyncCount+" - Attempts synced at end match: "+syncedOnEndMatchCount);
        Attempt lastAttempt = null;
        if (request.getAttempt() != null){
            lastAttempt = attemptService.syncAttempt(request.getAttempt(), match, request.getAttempt().getSync());
            lastAttempt.setSync(AttemptSyncState.syncOnEndMatch);
        }

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
}
