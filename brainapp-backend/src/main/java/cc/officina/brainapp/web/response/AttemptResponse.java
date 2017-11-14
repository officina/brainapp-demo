package cc.officina.brainapp.web.response;

import cc.officina.brainapp.domain.Attempt;
import cc.officina.brainapp.domain.Game;
import cc.officina.brainapp.domain.Match;
import cc.officina.brainapp.domain.MatchTemplate;

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
