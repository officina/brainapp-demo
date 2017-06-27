package cc.officina.gatorade.web.rest;

import com.codahale.metrics.annotation.Timed;

import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.service.AttemptService;
import cc.officina.gatorade.service.GameService;
import cc.officina.gatorade.service.MatchService;
import cc.officina.gatorade.web.response.AttemptResponse;
import cc.officina.gatorade.web.response.MatchResponse;
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

    public GameResource(GameService gameService, MatchService matchService, AttemptService attemptService) {
        this.gameService = gameService;
        this.matchService = matchService;
        this.attemptService = attemptService;
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

    /**
     * DELETE  /games/:id : delete the "id" game.
     *
     * @param id the id of the game to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/games/{id}")
    @Timed
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        log.debug("REST request to delete Game : {}", id);
        gameService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
    
    /**
     * GET  /games/:id : get the "id" game.
     *
     * @param gameId the id of the game to retrieve
     * @param playerId the id of the player
     * @param playtoken the sitecoretoken
     * @return the ResponseEntity with status 200 (OK) and with body the game, or with status 404 (Not Found)
     */
    @PostMapping("/play")
    @Timed
    public ResponseEntity<MatchResponse> startMatch(@RequestParam Long gameId, @RequestParam String playerId, @RequestParam String playtoken) {
        log.debug("REST request to startMatch : {}", gameId);
        Game game = gameService.findOne(gameId);
        //TODO gestione template
        if(game == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("game", "gameNotFound", "Game with id "+gameId + " not found")).body(null);
        else
        	return new ResponseEntity<>(gameService.startMatch(game, null, playerId), null, HttpStatus.OK);
    }
    
    @PostMapping("/play/attempt")
    @Timed
    public ResponseEntity<AttemptResponse> startAttempt(@RequestParam Long gameId, @RequestParam String playerId, @RequestParam Long matchId) {
        log.debug("REST request to startAttmept : {}", gameId);
        Game game = gameService.findOne(gameId);
        if(game == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("game", "gameNotFound", "Game with id "+gameId + " not found")).body(null);
        Match match = matchService.findOne(matchId);
        if(match == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("match", "matchNotFound", "Match with id "+matchId + " not found")).body(null);
        return new ResponseEntity<>(gameService.startAttempt(game, match), null, HttpStatus.OK);
    }

    /**
     * PUT  /play/updatescore: updates the score for the current attempt on the "id" game.
     *
     * @param gameId the id of the game to update
     * @param attemptId the id of the attemp to update
     * @param playerId the id of the player
     * @param playtoken the sitecoretoken or session string (//TODO definire)
     * @param newValue the updated score
     * @return the ResponseEntity with status 200 (OK) and with body the game, or with status 404 (Not Found)
     */
    @PutMapping("/play/score")
    @Timed
    public ResponseEntity<AttemptResponse> updateGameScore(@RequestParam Long gameId, @RequestParam Long attemptId, @RequestParam Long playerId, @RequestParam String playtoken, @RequestParam String newValue) {
        log.debug("REST request to update score to {} for game Game : {}",newValue, gameId);
        Attempt attempt = attemptService.findOne(attemptId);
        //TODO aggiorno punteggio
        if(attempt == null)
        	return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("attempt", "attemptNotFound", "Attempt with id "+attemptId + " not found")).body(null);
        return new ResponseEntity<>(gameService.updateAttemptScore(attempt.getMatch().getGame(), attempt, new Long(newValue)), null, HttpStatus.OK);
    }
    /**
     * PUT  /play/end: ends the current attempt on the "id" game.
     *
     * @param gameId the id of the game to update
     * @param attemptId the id of the attemp to update
     * @param playerId the id of the player
     * @param playtoken the sitecoretoken or session string (//TODO definire)
     * @param finalValue the final score
     * @return the ResponseEntity with status 200 (OK) and with body the game, or with status 404 (Not Found)
     */
    @PutMapping("/play/end")
    @Timed
    public ResponseEntity<Game> endGame(@RequestParam Long gameId, @RequestParam Long attemptId, @RequestParam Long playerId, @RequestParam String playtoken, @RequestParam String finalValue) {
        log.debug("REST request to update score to {} and end game Game : {}",finalValue, gameId);
        Game game = gameService.findOne(gameId);

        //TODO setto punteggio finale e chiudo gioco
        Game result = gameService.save(game);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, game.getId().toString()))
            .body(result);

    }
}
