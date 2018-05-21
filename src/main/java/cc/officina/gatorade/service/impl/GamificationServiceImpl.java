package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.MailService;
import cc.playoff.sdk.PlayOff;
import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.repository.AttemptRepository;
import cc.officina.gatorade.repository.MatchRepository;
import cc.officina.gatorade.repository.SessionRepository;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
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
    private final AttemptRepository attemptRepository;
    private final MailService mailService;
    private static PlayOff po;
    @Value("${elaboration.interval}")
    private int interval; //intervallo di esecuzione del thread in secondi
    @Value("${elaboration.numUsers}")
    private int numUsers;
    @Value("${elaboration.numCommunityUsers}")
    private int numCommunityUsers;
    @Value("${playoff.client.id}")
    private String poClientId;
	@Value("${playoff.client.secret}")
    private String poClientSecret;
	@Value("${playoff.client.domain}")
    private String poDomain;

    public GamificationServiceImpl(SessionRepository sessionRepository, MatchRepository matchRepository, MailService mailService, AttemptRepository attemptRepository) {
        this.sessionRepository = sessionRepository;
        this.matchRepository = matchRepository;
        this.mailService = mailService;
        this.attemptRepository = attemptRepository;
    }

    @PostConstruct
	public void init() {
	   log.info("GamificationService init for " + poDomain);
	   log.info("GamificationService init clientId " + poClientId);
	   po = new PlayOff(poClientId, poClientSecret, null, "v2", poDomain);
	}

	@Override
	public void runAction(Match match)
	{
		try
		{
			if(checkMatchValidity(match))
			{
				log.info("Match with id " + match.getId() + " valid!");
			}
			else
			{
				devilryOnMatch(match);
			}

			HashMap<String, String> params = new HashMap<String, String>();
			params.put("player_id", match.getUserId());
			LinkedTreeMap<String, Object> requestBody = getRequestByType(match);
			Object response = null;
			String path = "/runtime/actions/"+match.getGame().getActionId()+"/play";
			try
			{
				response = po.post(path, params, requestBody);
				match.setSendToPo(true);
			}
			catch(Exception e)
			{
				e.printStackTrace();
				if(!e.getMessage().contains("Player with ID"))
				{
					log.info("Run-action fails, init again...");
					init();
					log.info("Run-action again");
					response = po.post(path, params, requestBody);
					match.setSendToPo(true);
					log.debug(response.toString());
				}
			}
		} catch (Exception e) {
			//se passo in questo catch significa che l'invio verso po è nuovamente fallito e quindi devo mettere a false il relativo flag oltre che ad incrementare il numero di retry
			match.setSendToPo(false);
			match.setRetry(match.getRetry() + 1);
			log.error("error for playerId = " + match.getUserId() + " and action_id = " + match.getGame().getActionId());
			log.error(e.getMessage());
			e.printStackTrace();
		}
	}

	@Override
	public void runResetAction(Match match) {
		try {
			HashMap<String, String> params = new HashMap<String, String>();
			params.put("player_id", match.getUserId());
			LinkedTreeMap<String, Object> requestBody = getRequestByType(match);
			Object response = null;
			//la action
			String path = "/runtime/actions/"+match.getGame().getActionId()+"_reset/play";
			try
			{
				response = po.post(path, params, requestBody);
			}
			catch(Exception e)
			{
				log.info("Run-Reset-action fails, init again...");
				init();
				log.info("Run-Reset-action again");
				response = po.post(path, params, requestBody);
			}
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
		int numberOfUsers = numUsers;
		if (s.getExtId().startsWith("community_")){
		    numberOfUsers = numCommunityUsers;
		    log.info("Elaborate Community team session, number of user: "+numberOfUsers);
        }else{
            log.info("Elaborate Laboratorio team session, number of user: "+numberOfUsers);
        }
		while(matches.size() > 0 && samples.size() < numberOfUsers && matches.size() > 0)
		{
			int index = new Random().nextInt(matches.size());
			Match randomMatch = matches.get(index);
			//aggiungo solo se effettivamente lo user ha eseguito almeno una giocata ed il match è valido
			if(!randomMatch.isValid())
				log.info("Match not valid");
			if(randomMatch.getAttempts().size() > 0 && randomMatch.isValid() && checkPOUser(randomMatch) && checkMatchValidity(randomMatch))
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
		Object response = null;
		HashMap<String, String> params = new HashMap<String, String>();
		params.put("player_id", match.getUserId());
		String path = "/runtime/player/";
		try {
			response = po.get(path, params);
			//non va in eccezione la get, quindi il player esiste
			return true;
		} catch (Exception e) {
			//vado in eccezione, lo user non esiste
			log.error("Error for playerId " + match.getUserId() + " on check");
			log.error(e.getMessage());
			mailService.sendMatchNotValidAlert(match, "Eccezione playoff: " + e.getMessage());
			log.info("Run-action fails, init again...");
			init();
			log.info("Run-action again");
			try {
				response = po.get(path, params);
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			log.debug(response.toString());
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
		switch (match.getGame().getType())
		{
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
		log.info("Rielaborate session");
		for(Match m : session.getMatches())
		{
			System.out.println("Match con id = " + m.getId() + " e flag " + m.isUsedToPO());
			if(m.isUsedToPO())
			{
				String newId = m.getSession().getPoRoot();
				String oldId = m.getUserId();
				log.info("Match of user " + oldId + " used as fake match");
				m.setUserId(newId);
				runAction(m);
				m.setUserId(oldId);
			}
			System.out.println("DOPO - Match con id = " + m.getId() + " e flag " + m.isUsedToPO());
		}

	}

	private void devilryOnMatch(Match match) {
		switch (match.getGame().getType())
		{
			case POINT:
				break;
			case MINPOINT:
				for(Attempt a : match.getAttempts())
				{
					if(!a.isCompleted() && match.getGame().getDefaultScore() != null)
					{
						a.setAttemptScore(match.getGame().getDefaultScore());
						attemptRepository.saveAndFlush(a);
					}
				}
				break;
			case LEVEL:
				break;
		}

	}
}
