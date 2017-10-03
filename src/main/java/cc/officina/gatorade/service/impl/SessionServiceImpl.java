package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.MatchService;
import cc.officina.gatorade.service.SessionService;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.repository.SessionRepository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing Session.
 */
@Service
@Transactional
public class SessionServiceImpl implements SessionService{

    private final Logger log = LoggerFactory.getLogger(SessionServiceImpl.class);

    private final SessionRepository sessionRepository;
    private final GamificationService gamificationService;
    private final MatchService matchService;
    
    private final int numUsers = 5; 
    	
    public SessionServiceImpl(SessionRepository sessionRepository, GamificationService gamificationService, MatchService matchService) {
        this.sessionRepository = sessionRepository;
        this.gamificationService = gamificationService;
        this.matchService = matchService;
    }

    /**
     * Save a session.
     *
     * @param session the entity to save
     * @return the persisted entity
     */
    @Override
    public Session save(Session session) {
        log.debug("Request to save Session : {}", session);
        return sessionRepository.save(session);
    }

    /**
     *  Get all the sessions.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Session> findAll(Pageable pageable) {
        log.debug("Request to get all Sessions");
        return sessionRepository.findAll(pageable);
    }

    /**
     *  Get one session by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Session findOne(Long id) {
        log.debug("Request to get Session : {}", id);
        return sessionRepository.findOne(id);
    }

    /**
     *  Delete the  session by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Session : {}", id);
        sessionRepository.delete(id);
    }

	@Override
	public boolean validateSessionAndUser(String extid, String playerid, Long gameid) {
		// TODO: implementazione logica validaione sessione e player
		boolean result = false;
		Session session = sessionRepository.findValidByExtId(extid,ZonedDateTime.now(), gameid);
		if(session == null)
			return false;
		List<Match> matches = matchService.findByUserAndId(playerid, session.getId());
		
		if(matches == null || matches.size() == 0)
			return true;
		
		for(Match match : matches)
		{
			//se esiste già un match la chiamata viene invaliata
			if(match != null && match.getAttempts() != null && match.getAttempts().size() > 0)
				return false;
		}

		if(session != null)
			result = true;
		return result;
	}

	@Override
	public Session findOneByExtId(String extSessionId) {
		return sessionRepository.findByExtId(extSessionId);
	}
	
	@Override
	public Session findOneByExtId(String extid, Long gameid) {
		return sessionRepository.findByExtId(extid, gameid);
	}

	@Override
	public Session saveAndSchedule(Game game, Session session) {
		session.setElaborated(false);
//		gamificationService.schedule(game, session);
		return sessionRepository.save(session);
	}

	@Override
	public List<Session> findPending(ZonedDateTime now) {
		return sessionRepository.findPendingSessions(now);
	}

	@Override
	@Transactional
	public void elaborate(Session session) {
		gamificationService.elaborate(session);
	}

	@Override
	public void rielaborate(Session session) {
		gamificationService.riElaborate(session);
	}
}
