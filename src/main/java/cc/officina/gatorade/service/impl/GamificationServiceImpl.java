package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GamificationService;
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
import cc.officina.gatorade.domain.GameType;
import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
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

    private final GameRepository gameRepository;
    private final MatchRepository matchRepository;
    private final AttemptRepository attemptRepository;
    private static PlayOff po;
    
    @Value("${playoff.client.id}")
    private String poClientId;
	@Value("${playoff.client.secret}")
    private String poClientSecret;
	
	private Map<Long,Timer> tasks;
    
    public GamificationServiceImpl(GameRepository gameRepository, MatchRepository matchRepository, AttemptRepository attemptRepository) {
        this.gameRepository = gameRepository;
        this.matchRepository = matchRepository;
        this.attemptRepository = attemptRepository;
        tasks = new HashMap<Long,Timer>();
        po = new PlayOff(poClientId, poClientSecret, null, "v2","playoff.cc");
    }

	public void schedule(Game game, Session session)
	{
		List<Match> playersId = matchRepository.findUserByExtId(session.getExtId());
		String actionId = game.getActionId();
		Date.from(session.getEndDate().toInstant());
		Timer task = new Timer();
//		task.schedule(new SessionTask(game, session,po),Date.from(ZonedDateTime.now().toInstant()));
		task.schedule(new SessionTask(game, session,po),Date.from(session.getEndDate().toInstant()));
		tasks.put(session.getId(),task);
	}


	@Override
	public void runAction(Match match) {
		HashMap<String, String> params = getParamsByType(match);
		LinkedTreeMap<String, Object> requestBody = new LinkedTreeMap<>();
		params.put("player_id", match.getUserId());
		Object response = null;
		String path = "/runtime/actions/"+match.getGame().getActionId()+"/play";
		try {
			response = po.post(path, params, requestBody);
		} catch (IOException | PlayOffException e) {
			log.error("error for playerId = " + match.getUserId() + " and action_id = " + match.getGame().getActionId());
			log.error(e.getMessage());
			e.printStackTrace();
		}
	}

	private HashMap<String, String> getParamsByType(Match match) {
		switch (match.getGame().getType()) {
		case POINT:
			return paramsPerPointGame(match);
		case LEVEL:
			return paramsPerLevelGame(match);
		default:
			return null;
		}
	}

	private HashMap<String, String> paramsPerLevelGame(Match match) {
		HashMap<String, String> result = new HashMap<String, String>();
		return result;
	}

	private HashMap<String, String> paramsPerPointGame(Match match) {
		HashMap<String, String> result = new HashMap<String, String>();
		result.put("punteggioPartita", match.getMaxScore());
		result.put("numeroTentativi", match.getAttempts().size()+"");
		result.put("punteggioMedio", match.getMeanScore());
		return result;
	}
	
	
}
