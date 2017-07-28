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
    @Value("${elaboration.interval}")
    private int interval; //intervallo di esecuzione del thread in secondi
    @Value("${elaboration.numUsers}")
    private int numUsers;
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
	   log.info("GamificationService init clientId " + poClientId);
	   log.info("GamificationService init clientSecret " + poClientSecret);
	   po = new PlayOff(poClientId, poClientSecret, null, "v2", poDomain);
	   log.info("Attivazione batch");
	   Timer task = new Timer();
	   task.schedule(new SessionTask(this), 0, interval*1000);
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
		} catch (Exception e) {
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
		LinkedTreeMap<String, Object> result = new LinkedTreeMap<String, Object>();
		HashMap<String,Object> variables = new HashMap<String,Object>();
		//per scelta di design, il livello viene passato nella variabile punteggio
		variables.put("livello", "0");
		variables.put("punteggio", match.getMaxLevel());
		variables.put("tentativi", match.getAttempts().size());
		variables.put("punteggioMedio", match.getMeanScore());
		result.put("variables", variables);
		log.info("Level to playoff: " + match.getMaxLevel());
		return result;
	}

	private LinkedTreeMap<String, Object> paramsPerPointGame(Match match) {	
		LinkedTreeMap<String, Object> result = new LinkedTreeMap<String, Object>();
		HashMap<String,Object> variables = new HashMap<String,Object>();
		variables.put("punteggio", match.getMaxScore());
		variables.put("livello", match.getMaxLevel());
		variables.put("tentativi", match.getAttempts().size());
		variables.put("punteggioMedio", match.getMeanScore());
		result.put("variables", variables);
		log.info("Points to playoff: " + match.getMaxScore());
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
		log.info("Matches size for elaboration: " + s.getMatches().size());
		matches.addAll(s.getMatches());
		while(matches.size() > 0 && samples.size() < numUsers && matches.size() > 0)
		{
			int index = new Random().nextInt(matches.size());
			Match randomMatch = matches.get(index);
			//aggiungo solo se effettivamente lo user ha eseguito almeno una chiamata
			if(randomMatch.getAttempts().size() > 0)
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
	// 
	@Override
	@Transactional
	public void elaboratePending(ZonedDateTime now) {
		List<Session> sessions = sessionRepository.findPendingSessions(now);
		for(Session s : sessions)
		{
			elaborate(s);
		}
		
	}
	
	
}
