package cc.officina.gatorade.service;

import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.web.response.AttemptResponse;
import cc.officina.gatorade.web.response.MatchResponse;

import java.time.ZonedDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing Game.
 */
public interface GamificationService {

//	public void schedule(Game game, Session session);

	public void runAction(Match match);
	public void elaborate(Session s);
	public void elaboratePending(ZonedDateTime now);
	public void riElaborate(Session session);
	public void runResetAction(Match match);
}