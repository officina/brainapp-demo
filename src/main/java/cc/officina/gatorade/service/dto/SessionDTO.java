package cc.officina.gatorade.service.dto;

import java.time.ZonedDateTime;
import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Session;

public class SessionDTO {
    private Long id;

    private ZonedDateTime startDate;

    private ZonedDateTime endDate;

    private String extId;

    private String poRoot;

    private Boolean elaborated;

    private Game game;

    private MatchDTO validMatch;

    private Boolean ended = false;

    private Boolean played = false;

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

    public void setEnded(Boolean ended) {
        this.ended = ended;
    }

    public Boolean getPlayed() {
        if (this.validMatch != null){
            this.played = true;
        }else{
            this.played = false;
        }
        return this.played;
    }

    public void setPlayed(Boolean played) {
        this.played = played;
    }

    public Boolean getEnded(){
	    if (ZonedDateTime.now().isAfter(this.startDate) && ZonedDateTime.now().isBefore(this.endDate)){
	        this.ended = false;
        }else{
            this.ended = true;
        }
        return this.ended;
    }

    public void setValidMatch(MatchDTO validMatch)
	{
		this.validMatch = validMatch;
	}

    public SessionDTO(){
        //empty constructor
    }

    public SessionDTO(Long id, ZonedDateTime startDate, ZonedDateTime endDate, String extId, String poRoot, Boolean elaborated) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.extId = extId;
        this.poRoot = poRoot;
        this.elaborated = elaborated;
    }

    public SessionDTO(Session session){
        this(session.getId(), session.getStartDate(), session.getEndDate(), session.getExtId(), session.getPoRoot(), session.isElaborated());
    }
}
