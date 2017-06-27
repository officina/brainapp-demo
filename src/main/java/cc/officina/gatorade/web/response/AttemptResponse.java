package cc.officina.gatorade.web.response;

import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;

public class AttemptResponse extends MatchResponse {

	private Attempt attempt;
	
	public AttemptResponse(Game game, Match match, MatchTemplate template, Attempt attempt) {
		super(game, match, template);
		this.attempt = attempt;
	}

	public Attempt getAttempt() {
		return attempt;
	}

	public void setAttempt(Attempt attempt) {
		this.attempt = attempt;
	}
	
}
