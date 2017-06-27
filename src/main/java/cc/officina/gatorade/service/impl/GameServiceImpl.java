package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GameService;
import cc.officina.gatorade.web.response.AttemptResponse;
import cc.officina.gatorade.web.response.MatchResponse;
import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;
import cc.officina.gatorade.repository.AttemptRepository;
import cc.officina.gatorade.repository.GameRepository;
import cc.officina.gatorade.repository.MatchRepository;

import java.time.ZonedDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.datatype.jsr310.ser.key.ZonedDateTimeKeySerializer;


/**
 * Service Implementation for managing Game.
 */
@Service
@Transactional
public class GameServiceImpl implements GameService{

    private final Logger log = LoggerFactory.getLogger(GameServiceImpl.class);

    private final GameRepository gameRepository;
    private final MatchRepository matchRepository;
    private final AttemptRepository attemptRepository;

    public GameServiceImpl(GameRepository gameRepository, MatchRepository matchRepository, AttemptRepository attemptRepository) {
        this.gameRepository = gameRepository;
        this.matchRepository = matchRepository;
        this.attemptRepository = attemptRepository;
    }

    /**
     * Save a game.
     *
     * @param game the entity to save
     * @return the persisted entity
     */
    @Override
    public Game save(Game game) {
        log.debug("Request to save Game : {}", game);
        return gameRepository.save(game);
    }

    /**
     *  Get all the games.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Game> findAll(Pageable pageable) {
        log.debug("Request to get all Games");
        return gameRepository.findAll(pageable);
    }

    /**
     *  Get one game by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Game findOne(Long id) {
        log.debug("Request to get Game : {}", id);
        return gameRepository.findOne(id);
    }

    /**
     *  Delete the  game by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Game : {}", id);
        gameRepository.delete(id);
    }

	@Override
	public MatchResponse startMatch(Game game, MatchTemplate template, String playerId) {
		//TODO verificare presenza match già aperti e relativa logica da implementare
		Match match = new Match();
		match.setTemplate(template);
		match.setUserId(playerId);
		match.setStart(ZonedDateTime.now());
		match.setGame(game);
		matchRepository.save(match);
		MatchResponse response = new MatchResponse(game,match,template);
		return response;
	}

	@Override
	public AttemptResponse startAttempt(Game game, Match match) {
		//TODO verificare presenza attempt già aperti e relativa logica da implementare
		Attempt attempt = new Attempt();
		attempt.setMatch(match);
		attempt.setStartAttempt(ZonedDateTime.now());
		attempt.setLastUpdate(ZonedDateTime.now());
		attemptRepository.saveAndFlush(attempt);
		AttemptResponse response = new AttemptResponse(game, match, null,attempt);
		return response;
	}
	
	@Override
	public AttemptResponse updateAttemptScore(Game game, Attempt attempt, Long newValue) {
		//TODO verificare presenza attempt già aperti e relativa logica da implementare
		attempt.setAttemptScore(newValue);
		attempt.setLastUpdate(ZonedDateTime.now());
		attemptRepository.saveAndFlush(attempt);
		AttemptResponse response = new AttemptResponse(game, attempt.getMatch(), null,attempt);
		return response;
	}
}
