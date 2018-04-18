package cc.officina.gatorade.service.dto;

import cc.officina.gatorade.domain.Session;

import java.time.ZonedDateTime;

public class SessionDTO {
    private Long id;

    private ZonedDateTime startDate;

    private ZonedDateTime endDate;

    private String extId;

    private String poRoot;

    private Boolean elaborated;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    public ZonedDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate;
    }

    public String getExtId() {
        return extId;
    }

    public void setExtId(String extId) {
        this.extId = extId;
    }

    public String getPoRoot() {
        return poRoot;
    }

    public void setPoRoot(String poRoot) {
        this.poRoot = poRoot;
    }

    public Boolean getElaborated() {
        return elaborated;
    }

    public void setElaborated(Boolean elaborated) {
        this.elaborated = elaborated;
    }
}
