package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.domain.*;
import cc.officina.gatorade.domain.enumeration.AttemptSyncState;
import cc.officina.gatorade.domain.enumeration.MatchReplayState;
import cc.officina.gatorade.service.GameService;
import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.MatchService;
import cc.officina.gatorade.web.response.AttemptResponse;
import cc.officina.gatorade.web.response.MatchResponse;
import cc.officina.gatorade.repository.AttemptRepository;
import cc.officina.gatorade.repository.GameRepository;
import cc.officina.gatorade.repository.MatchRepository;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
        if(oldOne == null || !oldOne.isValid())
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
    public MatchResponse replayMatch(Game game, MatchTemplate template, String playerId, Session session, Long matchToken) {
        //creo un nuovo match con riferimento a oldOne
        Match oldOne = matchRepository.findOneByPlayerAndSession(game.getId(), template.getId(), playerId, session.getId());
        ZonedDateTime now = ZonedDateTime.now();
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
        match.setReplayState(MatchReplayState.playing);
        match.setParentId(oldOne.getId());
        oldOne.setReplayState(MatchReplayState.main);
        matchRepository.save(oldOne);
        matchRepository.save(match);
        return new MatchResponse(game,match,template);
    }

    @Override
    public MatchResponse cloneMatch(Game game, MatchTemplate template, String playerId, Session session, Long matchToken) {
        Match mainMatch = matchRepository.findMainMatch(game.getId(), playerId);
        if (mainMatch == null){
            //non ho match da clonare
            return null;
        }

        ZonedDateTime now = ZonedDateTime.now();
        Match cloned = new Match();
        cloned.setParentId(mainMatch.getId());
        cloned.setReplayState(MatchReplayState.cloned);
        cloned.setTemplate(mainMatch.getTemplate());
        cloned.setUserId(mainMatch.getUserId());
        cloned.setStart(now);
        cloned.setStop(now);
        cloned.setGame(mainMatch.getGame());
        cloned.setSession(mainMatch.getSession());
        cloned.setLastStart(now);
        cloned.setTimeSpent(0l);
        cloned.setElaborated(false);
        cloned.setMatchToken(new Date().getTime());
        cloned.setBestLevel(mainMatch.getBestLevel());
        cloned.setBestScore(mainMatch.getBestScore());
        cloned.setUsedToPO(false);
        cloned.setValid(true);

        Attempt attempt = new Attempt();
        attempt.setLocalId(new Date().getTime());
        attempt.setMatch(cloned);
        attempt.setStartAttempt(now);
        attempt.setLastUpdate(now);
        attempt.setStopAttempt(now);
        attempt.setAttemptScore(mainMatch.getBestScore());
        attempt.setLevelReached(mainMatch.getBestLevel());
        attempt.setCompleted(true);
        attempt.setCancelled(false);
        attempt.setValid(true);
        attempt.setSync(AttemptSyncState.sync);

        cloned.addAttempts(attempt);
        matchRepository.saveAndFlush(cloned);
        attemptRepository.saveAndFlush(attempt);
        return new MatchResponse(game,cloned,template);
    }

    @Override
	public AttemptResponse startAttempt(Game game, Match match) {
		//TODO verificare presenza attempt già aperti e relativa logica da implementare
		Attempt attempt = new Attempt();
		attempt.setLocalId(new Date().getTime());
		attempt.setMatch(match);
		attempt.setStartAttempt(ZonedDateTime.now());
		attempt.setLastUpdate(ZonedDateTime.now());
		attempt.setAttemptScore(0l);
		attempt.setLevelReached("0");
		attempt.setCompleted(false);
		attempt.setCancelled(false);
		attempt.setValid(true);
		attempt.setSync(AttemptSyncState.notSync);
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
		}
        match.setBestLevel(match.getMaxLevel());
        if (match.getGame().getType() == GameType.MINPOINT){
            match.setBestScore(Long.parseLong(match.getMinScore()));
        }else if(match.getGame().getType() == GameType.POINT){
            match.setBestScore(Long.valueOf(match.getMaxScore()));
        }

        match.setElaborated(true);
        match.setStop(now);
        match.setTimeSpent(match.getTimeSpent() + ChronoUnit.SECONDS.between(match.getLastStart(), now));

        Match mainMatch = matchRepository.findMainMatch(match.getGame().getId(), match.getUserId());
        if (mainMatch != null){
            if (match.getReplayState() != MatchReplayState.cloned){
                gamificationService.runResetAction(mainMatch);
                mainMatch.setReplayState(MatchReplayState.old);
                matchRepository.saveAndFlush(mainMatch);
            }
        }

        gamificationService.runAction(match);
        match.setReplayState(MatchReplayState.main);
        matchRepository.saveAndFlush(match);

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
