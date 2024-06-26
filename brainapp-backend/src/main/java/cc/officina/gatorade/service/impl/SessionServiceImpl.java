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
import java.util.*;

import javax.persistence.EntityManager;

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
	public Map<Boolean, String> validateSessionAndUser(Long sessionid, String playerid, Long gameid) {
		// TODO: implementazione logica validaione sessione e player
        Map<Boolean, String> resultMap = new HashMap<>();
		boolean result = false;
		Session session = sessionRepository.findValidById(sessionid,ZonedDateTime.now(), gameid);
		if(session == null)
		{
			log.info("Session not valid - session (by id) not found");
            resultMap.put(false, "missingSession");
			return resultMap;
		}

		if (session.getPoRoot() != null && session.getPoRoot().startsWith("top_user_")){
		    log.info("Validate Session for Top user: "+ playerid+" - session id: "+sessionid+" - gameid: "+gameid);
            resultMap.put(true, "topUserSession");
		    return resultMap;
        }else{
            List<Match> matches = matchService.findByUserAndId(playerid, session.getId());

            if(matches == null || matches.size() == 0){
                resultMap.put(true, "");
                return resultMap;
            }

            for(Match match : matches)
            {
                //se esiste già un match la chiamata viene invalidata
                if(match != null && match.isValid() && match.getAttempts() != null && match.getAttempts().size() > 0)
                {
                    if (match.getUserId().equals("atomasse")){
                        log.info("Demo exception: found match for user atomasse, due to demo purpose the user id will be replaced");
                        match.setUserId(match.getUserId()+"_"+System.currentTimeMillis());
                        matchService.save(match);
                        resultMap.put(true, "");
                        return resultMap;
                    } else {
                        log.info("Session not valid - A valid match for user " + playerid + " already exists inside session with extid " + sessionid);
                    }
                    //ha senso verificare se l'utente tenta di riaccedere al match perché in precedenza ha avuto problemi, è un buon trigger per tentare di risolvere l'eventyale pending
                    //chiaramente solo se effettivamente pending
                    if(match.isElaborated() && match.getSendToPo())
                    {
                        log.info("IL match è correttamente elaborato, non serve fare altro (match_id = " + match.getId() + ")");
                        resultMap.put(false, "matchElaborated");
                    }else{
                        TypeOfStillPending type = matchService.singleMatchRestore(match);
                        log.info("Tentativo di rielaborare il match (match_id = " + match.getId() + ") con risultato " + type);
                        if (type != null){
                            switch (type){
                                case NO_ATTEMPT:
                                    //non dovrebbe mai succedere
                                    break;
                                case RESTORE_FAIL:
                                    //non dovrebbe mai succedere
                                    break;
                                case NOT_ELABORATED:
                                    //match appeso
                                    if (match.getRestartable()){
                                        resultMap.put(false, "matchAnomalousRestartable");
                                    }else{
                                        resultMap.put(false, "matchAnomalous");
                                    }
                                    break;
                                case TO_PO_FAIL:
                                    if (match.isAnomalous()){
                                        resultMap.put(false, "failToSend");
                                    }else{
                                        resultMap.put(false, "sendingData");
                                    }
                                    break;
                                case SENT_TO_PO_NOT_ELABORATED:
                                    //non dovrebbe mai succedere
                                    break;
                            }
                        }else{
                            resultMap.put(false, "sessionAlreadyInUse");
                        }
                    }
                    return resultMap;
                }
            }

            if(session != null)
                resultMap.put(true, "");
            return resultMap;
        }
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
        if (session.getBypassable() == null){
            session.setBypassable(false);
        }
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
	public List<SessionDTO> getUserLabsSession(String userId, List<String> labs, Boolean active)
	{
		List<Session> sessions = getSessionsByLabs(labs, active);
        List<SessionDTO> sessionDtos = mapSessionsToDTOS(sessions);
		sessionDtos = setValidMatchToSessionDtos(userId, sessionDtos);
		return sessionDtos;
	}

	@Override
	public List<Session> getSessionsByLabs(List<String> labs, Boolean active){
        String query = "select s from Session s where 1 = 2 or (";
        for(String s : labs)
        {
            if (labs.get(0).equals(s)){
                query = query + "s.poRoot = '"+ s + "_aggregate'";
            }else{
                query = query + "or s.poRoot = '"+ s + "_aggregate'";
            }
        }
        query = query + ")";
        if (active != null && active){
            query = query+" and s.endDate >= now() and s.startDate <= now()";
        }
        query = query + " order by s.endDate asc";
        return entityManager.createQuery(query).getResultList();
    }

    @Override
    public List<Session> findAllByUserId(String userId, Boolean active) {
        if (active != null && active){
            return sessionRepository.findAllActiveByUserId(userId, ZonedDateTime.now());
        }else{
            return sessionRepository.findAllByUserId(userId);
        }
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
