package cc.officina.gatorade.domain;

public class Request {
	private Long gameid;
	private Long templateid;
	private Long matchid;
	private Long attemptid;
	private String playerid;
	private String playtoken;
	private Long score;
	private String level;
	private boolean completed;
	private Long sessionid;
	private boolean endmatch;
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
		if(this.score != null)
			return score;
		else
			return -1l;
	}
	public void setScore(Long score) {
		this.score = score;
	}
	public String getLevel() {
		if(level != null)
			return level;
		else
			return "";
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public boolean isCompleted() {
		return completed;
	}
	public void setCompleted(boolean completed) {
		this.completed = completed;
	}
	public Long getSessionid() {
		return sessionid;
	}
	public void setSessionid(Long sessionId) {
		this.sessionid = sessionId;
	}
	public boolean isEndmatch() {
		return endmatch;
	}
	public void setEndmatch(boolean endmatch) {
		this.endmatch = endmatch;
	}
}
