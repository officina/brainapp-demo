package cc.officina.gatorade.service.dto;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;

import cc.officina.gatorade.domain.Game;
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
    
    
}
