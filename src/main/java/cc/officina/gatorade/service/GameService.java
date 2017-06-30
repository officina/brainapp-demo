package cc.officina.gatorade.service;

import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;
import cc.officina.gatorade.web.response.AttemptResponse;
import cc.officina.gatorade.web.response.MatchResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing Game.
 */
public interface GameService {

    /**
     * Save a game.
     *
     * @param game the entity to save
     * @return the persisted entity
     */
    Game save(Game game);

    /**
     *  Get all the games.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Game> findAll(Pageable pageable);

    /**
     *  Get the "id" game.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Game findOne(Long id);

    /**
     *  Delete the "id" game.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);

	public MatchResponse startMatch(Game game, MatchTemplate template, String playerId);

	public AttemptResponse startAttempt(Game game, Match match);

	public AttemptResponse updateAttemptScore(Game game, Attempt attempt, Long newValue);

	public AttemptResponse stopAttempt(Game game, Attempt attempt, Long scoreReached, Long levelReached);

	public MatchResponse endMatch(Match match);
}
