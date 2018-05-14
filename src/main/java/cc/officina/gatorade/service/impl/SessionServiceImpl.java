package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.MatchService;
import cc.officina.gatorade.service.SessionService;
import cc.officina.gatorade.service.dto.MatchDTO;
import cc.officina.gatorade.service.dto.SessionDTO;
import cc.officina.gatorade.service.impl.MatchServiceImpl.TypeOfStillPending;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.repository.SessionRepository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.sun.org.apache.xpath.internal.operations.Bool;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private EntityManager entityManager;
    private final int numUsers = 5;
    private ModelMapper modelMapper = new ModelMapper();
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
	public boolean validateSessionAndUser(String extid, String playerid, Long gameid, Boolean replay) {
		// TODO: implementazione logica validaione sessione e player
		boolean result = false;
		Session session = sessionRepository.findValidByExtId(extid,ZonedDateTime.now(), gameid);
		if(session == null)
		{
			log.info("Session not valid - session (by extid) not found");
			return false;
		}

		if (replay == null){
            List<Match> matches = matchService.findByUserAndId(playerid, session.getId());

            if(matches == null || matches.size() == 0)
                return true;

            for(Match match : matches)
            {
                //se esiste già un match la chiamata viene invaliata
                if(match != null && match.isValid() && match.getAttempts() != null && match.getAttempts().size() > 0)
                {
                    log.info("Session not valid - A valid match for user " + playerid + " already exists inside session with extid " + extid);
                    //ha senso verificare se l'utente tenta di riaccedere al match perché in precedenza ha avuto problemi, è un buon trigger per tentare di risolvere l'eventyale pending
                    //chiaramente solo se effettivamente pending
                    if(match.isElaborated() && match.getSendToPo())
                    {
                        log.info("IL match è correttamente elaborato, non serve fare altro (match_id = " + match.getId() + ")");
                    }
                    {
                        TypeOfStillPending type = matchService.singleMatchRestore(match);
                        log.info("Tentativo di rielaborare il match (match_id = " + match.getId() + ") con risultato " + type);
                    }
                    return false;
                }
            }
        }else{
		    //nella richiesta di inizio gioco è specificato il parametro replay, valido la sessione.
		    return true;
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
    public List<Session> findAllByLabId(String labId) {
        return sessionRepository.findAllByLabId(labId);
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

	@Override
	public List<SessionDTO> getUserLabsSession(String userId, List<String> labs)
	{
		List<Session> sessions = getSessionsByLabs(labs);
        List<SessionDTO> sessionDtos = mapSessionsToDTOS(sessions);
		sessionDtos = setValidMatchToSessionDtos(userId, sessionDtos);
		return sessionDtos;
	}

	@Override
	public List<Session> getSessionsByLabs(List<String> labs){
        String query = "select s from Session s where 1 = 2 ";
        for(String s : labs)
        {
            query = query + "or s.poRoot = '"+ s + "_aggregate'";
        }
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public List<Session> findAllByUserId(String userId) {
        return sessionRepository.findAllByUserId(userId);
    }

    @Override
    public List<SessionDTO> mapSessionsToDTOS(List<Session> sessions){
	    List<SessionDTO> sessionDtos = new ArrayList<SessionDTO>();
        for(Session s : sessions) {
            SessionDTO sessionDto = modelMapper.map(s, SessionDTO.class);
            sessionDtos.add(sessionDto);
        }
        return sessionDtos;
    }

    @Override
    public List<SessionDTO> setValidMatchToSessionDtos(String userId, List<SessionDTO> sessionDtos){
        List<Match> matches = matchService.getMatchesByUserId(userId);
        Map<Long, Match> map = new HashMap<Long, Match>();
        for(Match m : matches) {
            map.put(m.getSession().getId(), m);
        }

        for(SessionDTO s : sessionDtos) {
            Match temp = map.get(s.getId());
            if(temp != null)
            {
                s.setValidMatch(modelMapper.map(temp, MatchDTO.class));
            }
        }
        return sessionDtos;
    }
}
