package cc.officina.gatorade.web.response;

import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;

public class MatchResponse {
	
	private Game game;
	private Match match;
	private MatchTemplate template;
	
	public MatchResponse(Game game, Match match, MatchTemplate template) {
		super();
		this.game = game;
		this.match = match;
		this.template = template;
	}
	
	public Game getGame() {
		return game;
	}
	public void setGame(Game game) {
		this.game = game;
	}
	public Match getMatch() {
		return match;
	}
	public void setMatch(Match match) {
		this.match = match;
	}

	public MatchTemplate getTemplate() {
		return template;
	}

	public void setTemplate(MatchTemplate template) {
		this.template = template;
	}

}
