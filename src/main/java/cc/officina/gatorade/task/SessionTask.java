package cc.officina.gatorade.task;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.internal.LinkedTreeMap;

import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.repository.MatchRepository;
import cc.officina.gatorade.service.GamificationService;
import cc.playoff.sdk.PlayOff;
import cc.playoff.sdk.PlayOff.PlayOffException;

public class SessionTask extends TimerTask {
	private final Logger log = LoggerFactory.getLogger(SessionTask.class);
	@Autowired
	private MatchRepository matchRepository;
	@Autowired
	private GamificationService gamificationService;
	private PlayOff po;
	private Game game;
	private Session session;
	private final int numUsers = 5;
	
	public SessionTask(Game game, Session session, PlayOff po)
	{
		this.game = game;
		this.session = session;
		this.po = po;
	}
	
	@Override
	public void run() {
		System.out.println("INIZIO BASH");
		// estraggo gli n utenti campione, utilizzare una mappa consente di evitare doppioni
		Map<String, Match> samples = new HashMap<String, Match>();
		List<Match> matches = new ArrayList<Match>();
		matches.addAll(game.getMatches());
		while(samples.size() < numUsers+1 && samples.size() < matches.size())
		{
			Match randomMatch = matches.get(new Random().nextInt(matches.size()));
			samples.put(randomMatch.getUserId(), randomMatch);
		}
		
		for(Match match : samples.values())
		{
			gamificationService.runAction(match);
		}
		System.out.println("FINE BASH");
	}

}
