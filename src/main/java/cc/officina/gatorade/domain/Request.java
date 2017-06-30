package cc.officina.gatorade.domain;

public class Request {
	private Long gameid;
	private Long templateid;
	private Long matchid;
	private Long attemptid;
	private String playerid;
	private String playtoken;
	private Long score;
	private Long level;
	public Long getGameid() {
		return gameid;
	}
	public void setGameid(Long gameid) {
		this.gameid = gameid;
	}
	public Long getTemplateid() {
		return templateid;
	}
	public void setTemplateid(Long templateid) {
		this.templateid = templateid;
	}
	public Long getMatchid() {
		return matchid;
	}
	public void setMatchid(Long matchid) {
		this.matchid = matchid;
	}
	public Long getAttemptid() {
		return attemptid;
	}
	public void setAttemptid(Long attemptid) {
		this.attemptid = attemptid;
	}
	public String getPlayerid() {
		return playerid;
	}
	public void setPlayerid(String playerid) {
		this.playerid = playerid;
	}
	public String getPlaytoken() {
		return playtoken;
	}
	public void setPlaytoken(String playtoken) {
		this.playtoken = playtoken;
	}
	public Long getScore() {
		return score;
	}
	public void setScore(Long score) {
		this.score = score;
	}
	public Long getLevel() {
		return level;
	}
	public void setLevel(Long level) {
		this.level = level;
	}
	
}
