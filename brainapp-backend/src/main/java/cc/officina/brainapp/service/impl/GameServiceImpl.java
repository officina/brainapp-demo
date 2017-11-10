package cc.officina.brainapp.service.impl;

import cc.officina.brainapp.service.GameService;
import cc.officina.brainapp.service.GamificationService;
import cc.officina.brainapp.web.response.AttemptResponse;
import cc.officina.brainapp.web.response.MatchResponse;
import cc.officina.brainapp.domain.Attempt;
import cc.officina.brainapp.domain.Game;
import cc.officina.brainapp.domain.Match;
import cc.officina.brainapp.domain.MatchTemplate;
import cc.officina.brainapp.domain.Session;
import cc.officina.brainapp.repository.AttemptRepository;
import cc.officina.brainapp.repository.GameRepository;
import cc.officina.brainapp.repository.MatchRepository;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


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
    private final GamificationService gamificationService;

    public GameServiceImpl(GameRepository gameRepository, MatchRepository matchRepository, 
    		AttemptRepository attemptRepository,GamificationService gamificationService) {
        this.gameRepository = gameRepository;
        this.matchRepository = matchRepository;
        this.attemptRepository = attemptRepository;
        this.gamificationService = gamificationService;
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
	public MatchResponse startMatch(Game game, MatchTemplate template, String playerId, Session session, Long matchToken) {
		//TODO verificare presenza match già aperti e relativa logica da implementare
		Match oldOne = matchRepository.findOneByPlayerAndSession(game.getId(), template.getId(), playerId, session.getId());
		ZonedDateTime now = ZonedDateTime.now();
		if(oldOne == null || !oldOne.getValid())
		{
			Match match = new Match();
			match.setTemplate(template);
			match.setUserId(playerId);
			match.setStart(now);
			match.setGame(game);
			match.setSession(session);
			match.setLastStart(now);
			match.setTimeSpent(0l);
			match.setElaborated(false);
			match.setMatchToken(matchToken);
			match.setUsedToPO(false);
			match.setValid(true);
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
		attempt.setLevelReached("0");
		attempt.setCompleted(false);
		attempt.setCancelled(false);
		attempt.setValid(true);
		attemptRepository.saveAndFlush(attempt);
		log.info("New attempt created with id = " + attempt.getId());
		AttemptResponse response = new AttemptResponse(game, match, null,attempt);
		return response;
	}
	
	@Override
	public AttemptResponse updateAttemptScore(Game game, Attempt attempt, Long newScore, String newLevel) {
		//TODO verificare presenza attempt già aperti e relativa logica da implementare
		if(! attempt.isCompleted())
		{
			attempt.setAttemptScore(newScore);
			if(Long.parseLong(newLevel) > Long.parseLong(attempt.getLevelReached()))
			{
				attempt.setLevelReached(newLevel);
			}
			attempt.setLastUpdate(ZonedDateTime.now());
			attemptRepository.saveAndFlush(attempt);
		}
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
		if(match.isElaborated())
		{
			return new MatchResponse(game, match, match.getTemplate());
		}
		if(lastAttempt != null)
		{
			lastAttempt.setAttemptScore(score);
			lastAttempt.setLevelReached(level);
			//si assume che un attempt chiuso in concomitanza al match risulta non completato
			lastAttempt.setCompleted(false);
			lastAttempt.setLastUpdate(now);
			lastAttempt.setStopAttempt(now);
//			attemptRepository.saveAndFlush(lastAttempt);
		}
		match.setStop(now);
		match.setElaborated(true);
		match.setTimeSpent(match.getTimeSpent() + ChronoUnit.SECONDS.between(match.getLastStart(), now));
		matchRepository.saveAndFlush(match);
		gamificationService.runAction(match);
		MatchResponse response = new MatchResponse(game, match, match.getTemplate());
		return response;
	}
	
	@Override
	public MatchResponse endMatchRestore(Game game, Match match, Attempt lastAttempt, Long score, String level) {
		ZonedDateTime now = ZonedDateTime.now();
		match.getAttempts().size();
		gamificationService.runAction(match);
		MatchResponse response = new MatchResponse(game, match, match.getTemplate());
		return response;
	}
}