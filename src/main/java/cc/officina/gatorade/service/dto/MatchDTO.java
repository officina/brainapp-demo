package cc.officina.gatorade.service.dto;

import java.time.ZonedDateTime;
import cc.officina.gatorade.domain.Match;

public class MatchDTO
{
	private Long id;

    private ZonedDateTime start;

    private ZonedDateTime stop;

    private Long diffLevel;

    private String userId;

    private ZonedDateTime lastStart;

    private Long timeSpent;

    private Boolean usedToPO;

    private Boolean elaborated;

    private Long matchToken;

    private String bestLevel;

    private Long bestScore;

    public Long getId()
	{
		return id;
	}

	public void setId(Long id)
	{
		this.id = id;
	}

	public ZonedDateTime getStart()
	{
		return start;
	}

	public void setStart(ZonedDateTime start)
	{
		this.start = start;
	}

	public ZonedDateTime getStop()
	{
		return stop;
	}

	public void setStop(ZonedDateTime stop)
	{
		this.stop = stop;
	}

	public Long getDiffLevel()
	{
		return diffLevel;
	}

	public void setDiffLevel(Long diffLevel)
	{
		this.diffLevel = diffLevel;
	}

	public String getUserId()
	{
		return userId;
	}

	public void setUserId(String userId)
	{
		this.userId = userId;
	}

	public ZonedDateTime getLastStart()
	{
		return lastStart;
	}

	public void setLastStart(ZonedDateTime lastStart)
	{
		this.lastStart = lastStart;
	}

	public Long getTimeSpent()
	{
		return timeSpent;
	}

	public void setTimeSpent(Long timeSpent)
	{
		this.timeSpent = timeSpent;
	}

	public Boolean getUsedToPO()
	{
		return usedToPO;
	}

	public void setUsedToPO(Boolean usedToPO)
	{
		this.usedToPO = usedToPO;
	}

	public Boolean getElaborated()
	{
		return elaborated;
	}

	public void setElaborated(Boolean elaborated)
	{
		this.elaborated = elaborated;
	}

	public Long getMatchToken()
	{
		return matchToken;
	}

	public void setMatchToken(Long matchToken)
	{
		this.matchToken = matchToken;
	}

    public String getBestLevel() {
        return bestLevel;
    }

    public void setBestLevel(String bestLevel) {
        this.bestLevel = bestLevel;
    }

    public Long getBestScore() {
        return bestScore;
    }

    public void setBestScore(Long bestScore) {
        this.bestScore = bestScore;
    }

    public MatchDTO(){
        //empty constructor
    }

    public MatchDTO(Long id, ZonedDateTime start, ZonedDateTime stop, Long diffLevel, String userId, ZonedDateTime lastStart, Long timeSpent, Boolean usedToPO, Boolean elaborated, Long matchToken, String bestLevel, Long bestScore) {
        this.id = id;
        this.start = start;
        this.stop = stop;
        this.diffLevel = diffLevel;
        this.userId = userId;
        this.lastStart = lastStart;
        this.timeSpent = timeSpent;
        this.usedToPO = usedToPO;
        this.elaborated = elaborated;
        this.matchToken = matchToken;
        this.bestLevel = bestLevel;
        this.bestScore = bestScore;
    }

    public MatchDTO(Match match) {
        this(match.getId(), match.getStart(), match.getStop(), match.getDiffLevel(), match.getUserId(), match.getLastStart(), match.getTimeSpent(), match.isUsedToPO(), match.isElaborated(), match.getMatchToken(), match.getBestLevel(), match.getBestScore());
    }
}
