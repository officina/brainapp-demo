package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.SessionService;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.repository.SessionRepository;
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

    public SessionServiceImpl(SessionRepository sessionRepository, GamificationService gamificationService) {
        this.sessionRepository = sessionRepository;
        this.gamificationService = gamificationService;
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
	public boolean validateSessionAndUser(String extid, String playerid) {
		// qui va implementata tutta la logica di validazione della sessione e del player
		boolean result = false;
		Session session = sessionRepository.findByExtId(extid);
		if(session != null)
			result = true;
		return result;
	}

	@Override
	public Session findOneByExtId(String extSessionId) {
		return sessionRepository.findByExtId(extSessionId);
	}

	@Override
	public Session saveAndSchedule(Game game, Session session) {
		session.setElaborated(false);
		gamificationService.schedule(game, session);
		return sessionRepository.save(session);
	}
}
