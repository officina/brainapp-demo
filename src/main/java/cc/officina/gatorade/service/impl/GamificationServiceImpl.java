package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.MailService;
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
    private final MatchRepository matchRepository;
    private final MailService mailService;
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

    public GamificationServiceImpl(SessionRepository sessionRepository, MatchRepository matchRepository, MailService mailService) {
        this.sessionRepository = sessionRepository;
        this.matchRepository = matchRepository;
        this.mailService = mailService;
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
			if(!checkMatchValidity(match))
			{
				log.info("Match with id " + match.getId() + " not valid for Playoff.");
				return;
			}
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
			case MINPOINT:
				return paramsPerMinPointGame(match);
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
	
	private LinkedTreeMap<String, Object> paramsPerMinPointGame(Match match) {	
		LinkedTreeMap<String, Object> result = new LinkedTreeMap<String, Object>();
		HashMap<String,Object> variables = new HashMap<String,Object>();
		variables.put("punteggio", match.getMinScore());
		variables.put("livello", "0");
		variables.put("tentativi", match.getAttempts().size());
		variables.put("punteggioMedio", match.getMeanScore());
		result.put("variables", variables);
		log.info("Points to playoff: " + match.getMinScore());
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
			if(randomMatch.getAttempts().size() > 0 && checkPOUser(randomMatch) && checkMatchValidity(randomMatch))
				samples.put(randomMatch.getUserId(), randomMatch);
			matches.remove(index);
		}
//		int numPlayer = 1;
		
		for(Match match : samples.values())
		{
//			String newId = match.getSession().getPoRoot()+"_"+String.format("%02d", numPlayer);
			String newId = match.getSession().getPoRoot();
			String oldId = match.getUserId();
			log.info("Match of user " + oldId + " used as fake match");
			match.setUserId(newId);
			runAction(match);
			match.setUserId(oldId);
			match.setUsedToPO(true);
//			numPlayer++;
		}
		matchRepository.save(samples.values());
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
	
	private boolean checkPOUser(Match match) {
		try {
			HashMap<String, String> params = new HashMap<String, String>();
			params.put("player_id", match.getUserId());
			String path = "/runtime/player/";
			Object response = po.get(path, params);
			//non va in eccezione la get, quindi il player esiste
			return true;
		} catch (Exception e) {
			//vado in eccezione, lo user non esiste
			log.error("Error for playerId " + match.getUserId() + " on check");
			log.error(e.getMessage());
			mailService.sendMatchNotValidAlert(match, "Eccezione playoff: " + e.getMessage());
			return false;
		}
	}
	
	/*
	 * UN MATCH VIENE RITENUTO VALIDO QUANDO (determinato con Milani il 19/09/2017):
	 * NEL CASO MINPOINT: se il punteggio e non nullo e diverso da zero
	 * NEL CASO POINT: se il punteggio massimo è non nullo
	 * NEL CASO MAX LEVEL: se il massimo livello e non nullo
	 */
	private boolean checkMatchValidity(Match match) {
		boolean flag = true;
		switch (match.getGame().getType()) {
		case POINT:
			//un match a max point è sempre valido
			break;
		case MINPOINT:
			String tempMin = match.getMinScore();
			if(tempMin == null || tempMin.equalsIgnoreCase("0"))
				flag = false;
			break;
		case LEVEL:
			String tempLevel = match.getMaxLevel();
			if(tempLevel == null)
				flag = false;
			break;
		}
		
		if(!flag)
		{
			mailService.sendMatchNotValidAlert(match, "Anomalia nei punteggi");
		}
		
		return flag;
	}

	@Override
	public void riElaborate(Session session) {
		log.debug("Rielaborate session");
		for(Match m : session.getMatches())
		{
			if(m.isUsedToPO())
			{
				String newId = m.getSession().getPoRoot();
				String oldId = m.getUserId();
				log.info("Match of user " + oldId + " used as fake match");
				m.setUserId(newId);
				runAction(m);
				m.setUserId(oldId);
			}
		}
		
	}
	
	
}
