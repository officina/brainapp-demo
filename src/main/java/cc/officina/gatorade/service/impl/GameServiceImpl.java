package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GameService;
import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.web.response.AttemptResponse;
import cc.officina.gatorade.web.response.MatchResponse;
import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.repository.AttemptRepository;
import cc.officina.gatorade.repository.GameRepository;
import cc.officina.gatorade.repository.MatchRepository;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

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
	public MatchResponse startMatch(Game game, MatchTemplate template, String playerId, Session session) {
		//TODO verificare presenza match già aperti e relativa logica da implementare
		Match oldOne = matchRepository.findOneByPlayerAndSession(game.getId(), template.getId(), playerId, session.getId());
		ZonedDateTime now = ZonedDateTime.now();
		if(oldOne == null)
		{
			Match match = new Match();
			match.setTemplate(template);
			match.setUserId(playerId);
			match.setStart(now);
			match.setGame(game);
			match.setSession(session);
			match.setLastStart(now);
			match.setTimeSpent(0l);
			matchRepository.save(match);
			return new MatchResponse(game,match,template);
		}
		else
		{
			oldOne.setLastStart(now);
		}
		log.info(""+oldOne.getAttempts().size());
		return new MatchResponse(game,oldOne,template);
	}

	@Override
	public AttemptResponse startAttempt(Game game, Match match) {
		//TODO verificare presenza attempt già aperti e relativa logica da implementare
		Attempt attempt = new Attempt();
		attempt.setMatch(match);
		attempt.setStartAttempt(ZonedDateTime.now());
		attempt.setLastUpdate(ZonedDateTime.now());
		attempt.setAttemptScore(0l);
		attempt.setCompleted(false);
		attempt.setCancelled(false);
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

	@Override
	public MatchResponse stopAttempt(Game game, Attempt attempt, boolean completed, Long scoreReached, String levelReached, boolean endMatch) {
		attempt.setAttemptScore(scoreReached);
		attempt.setLevelReached(levelReached);
		attempt.setCompleted(completed);
		attempt.setLastUpdate(ZonedDateTime.now());
		attempt.setStopAttempt(ZonedDateTime.now());
		attemptRepository.saveAndFlush(attempt);
		if(endMatch)
		{
			attempt.getMatch().setStop(ZonedDateTime.now());
			matchRepository.saveAndFlush(attempt.getMatch());
		}
		MatchResponse response = new MatchResponse(game, attempt.getMatch(), attempt.getMatch().getTemplate());
		return response;
	}

	@Override
	public MatchResponse endMatch(Game game, Match match, Attempt lastAttempt, Long score, String level) {
		ZonedDateTime now = ZonedDateTime.now();
		match.getAttempts().size();
		if(lastAttempt != null)
		{
			lastAttempt.setAttemptScore(score);
			lastAttempt.setLevelReached(level);
			//i assume che un attempt chiuso in concomitanza al match risulta non completato
			lastAttempt.setCompleted(false);
			lastAttempt.setLastUpdate(now);
			lastAttempt.setStopAttempt(now);
			attemptRepository.saveAndFlush(lastAttempt);
		}
		match.setStop(now);
		System.out.println(match.getLastStart());
		System.out.println(now);
		System.out.println(ChronoUnit.SECONDS.between(match.getLastStart(), now));
		match.setTimeSpent(match.getTimeSpent() + ChronoUnit.SECONDS.between(match.getLastStart(), now));
		matchRepository.saveAndFlush(match);
		
		MatchResponse response = new MatchResponse(game, match, match.getTemplate());
		return response;
	}
}
