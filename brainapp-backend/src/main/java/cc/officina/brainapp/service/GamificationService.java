package cc.officina.brainapp.service;

import cc.officina.brainapp.domain.Match;
import cc.officina.brainapp.domain.Session;

import java.time.ZonedDateTime;

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
