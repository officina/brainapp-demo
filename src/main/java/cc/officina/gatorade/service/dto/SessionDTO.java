package cc.officina.gatorade.service.dto;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Match;

public class SessionDTO
{
	private Long id;

    private ZonedDateTime startDate;

    private ZonedDateTime endDate;

    private String extId;

    private String poRoot;

    private Boolean elaborated;

    private Game game;
    
    private MatchDTO validMatch;

	public Long getId()
	{
		return id;
	}

	public void setId(Long id)
	{
		this.id = id;
	}

	public ZonedDateTime getStartDate()
	{
		return startDate;
	}

	public void setStartDate(ZonedDateTime startDate)
	{
		this.startDate = startDate;
	}

	public ZonedDateTime getEndDate()
	{
		return endDate;
	}

	public void setEndDate(ZonedDateTime endDate)
	{
		this.endDate = endDate;
	}

	public String getExtId()
	{
		return extId;
	}

	public void setExtId(String extId)
	{
		this.extId = extId;
	}

	public String getPoRoot()
	{
		return poRoot;
	}

	public void setPoRoot(String poRoot)
	{
		this.poRoot = poRoot;
	}

	public Boolean getElaborated()
	{
		return elaborated;
	}

	public void setElaborated(Boolean elaborated)
	{
		this.elaborated = elaborated;
	}

	public Game getGame()
	{
		return game;
	}

	public void setGame(Game game)
	{
		this.game = game;
	}

	public MatchDTO getValidMatch()
	{
		return validMatch;
	}

	public void setValidMatch(MatchDTO validMatch)
	{
		this.validMatch = validMatch;
	}
    
}
