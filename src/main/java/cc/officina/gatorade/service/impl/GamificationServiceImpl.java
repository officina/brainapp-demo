package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.SessionService;
import cc.officina.gatorade.task.SessionTask;
import cc.playoff.sdk.PlayOff;
import cc.playoff.sdk.PlayOff.PlayOffException;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.GameType;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.repository.AttemptRepository;
import cc.officina.gatorade.repository.GameRepository;
import cc.officina.gatorade.repository.MatchRepository;
import cc.officina.gatorade.repository.SessionRepository;
import cc.officina.gatorade.domain.GameType;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Timer;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.internal.LinkedTreeMap;


/**
 * Service Implementation for managing Game.
 */
@Service
@Transactional
public class GamificationServiceImpl implements GamificationService{

    private final Logger log = LoggerFactory.getLogger(GamificationServiceImpl.class);

    private final SessionRepository sessionRepository;
    private static PlayOff po;
    private static int interval = 1000; //intervallo di esecuzione del thread in secondi
    private static int numUsers = 2;
    
    @Value("${playoff.client.id}")
    private String poClientId;
	@Value("${playoff.client.secret}")
    private String poClientSecret;
	@Value("${playoff.client.domain}")
    private String poDomain;

    public GamificationServiceImpl(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
        po = new PlayOff(poClientId, poClientSecret, null, "v2","playoff.cc");
    }
    
    @PostConstruct
	public void init() {
	   log.info("GamificationService init for " + poDomain);
	   po = new PlayOff(poClientId, poClientSecret, null, "v2", poDomain);
	   log.info("Attivazione batch");
	   Timer task = new Timer();
	   task.schedule(new SessionTask(this), 10*1000, 20*1000);
	}

	@Override
	public void runAction(Match match) {
		try {
			HashMap<String, String> params = new HashMap<String, String>();
			params.put("player_id", match.getUserId());
			LinkedTreeMap<String, Object> requestBody = getRequestByType(match);
			Object response = null;
			String path = "/runtime/actions/"+match.getGame().getActionId()+"/play";
			response = po.post(path, params, requestBody);
			log.debug(response.toString());
		} catch (IOException | PlayOffException e) {
			log.error("error for playerId = " + match.getUserId() + " and action_id = " + match.getGame().getActionId());
			log.error(e.getMessage());
			e.printStackTrace();
		}
	}

	private LinkedTreeMap<String, Object> getRequestByType(Match match) {
		switch (match.getGame().getType()) {
		case POINT:
			return paramsPerPointGame(match);
		case LEVEL:
			return paramsPerLevelGame(match);
		default:
			return null;
		}
	}

	private LinkedTreeMap<String, Object> paramsPerLevelGame(Match match) {
		log.error("Calcolo max level");
		LinkedTreeMap<String, Object> result = new LinkedTreeMap<String, Object>();
		HashMap<String,Object> variables = new HashMap<String,Object>();
		variables.put("punteggio", 5);
//		variables.put("punteggio", match.getMaxLevel());
//		variables.put("numeroTentativi", match.getAttempts().size()+"");
		result.put("variables", variables);
		return result;
	}

	private LinkedTreeMap<String, Object> paramsPerPointGame(Match match) {	
		LinkedTreeMap<String, Object> result = new LinkedTreeMap<String, Object>();
		HashMap<String,Object> variables = new HashMap<String,Object>();
		variables.put("punteggio", match.getMaxScore());
//		variables.put("numeroTentativi", match.getAttempts().size()+"");
//		variables.put("punteggioMedio", match.getMeanScore());
		result.put("variables", variables);
		return result;
	}
	
	@Override
	@Transactional
	public void elaborate(Session s) {
		
		log.info("Elaboration of session with id = " + s.getId() + " - START");
		s.setElaborated(true);
		sessionRepository.save(s);
		// estraggo gli n utenti campione, utilizzare una mappa consente di evitare doppioni
		Map<String, Match> samples = new HashMap<String, Match>();
		List<Match> matches = new ArrayList<Match>();
		matches.addAll(s.getGame().getMatches());
		while(matches.size() > 0 && samples.size() < numUsers && samples.size() < matches.size())
		{
			int index = new Random().nextInt(matches.size());
			Match randomMatch = matches.get(index);
			samples.put(randomMatch.getUserId(), randomMatch);
			matches.remove(index);
		}
		
		int numPlayer = 1;
		
		for(Match match : samples.values())
		{
			String newId = match.getSession().getPoRoot()+"_"+String.format("%02d", numPlayer);
			String oldId = match.getUserId();
			log.info("Match of user " + oldId + " used for fake-user " + newId);
			match.setUserId(newId);
			runAction(match);
			match.setUserId(oldId);
			numPlayer++;
		}
		log.info("Elaboration of session with id = " + s.getId() + " - END");
	}

	@Override
	public void elaboratePending(ZonedDateTime now) {
		List<Session> sessions = sessionRepository.findPendingSessions(now);
		for(Session s : sessions)
		{
			elaborate(s);
		}
		
	}
	
	
}
