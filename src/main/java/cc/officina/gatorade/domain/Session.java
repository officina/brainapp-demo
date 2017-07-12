package cc.officina.gatorade.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Session.
 */
@Entity
@Table(name = "session")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Session implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "start_date")
    private ZonedDateTime startDate;

    @Column(name = "end_date")
    private ZonedDateTime endDate;

    @Column(name = "ext_id")
    private String extId;

    @Column(name = "po_root")
    private String poRoot;

    @Column(name = "elaborated")
    private Boolean elaborated;

    @OneToMany(mappedBy = "session", fetch = FetchType.EAGER)
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Match> matches = new HashSet<>();

    @OneToOne
    @JoinColumn(unique = true)
    private Game game;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getStartDate() {
        return startDate;
    }

    public Session startDate(ZonedDateTime startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    public ZonedDateTime getEndDate() {
        return endDate;
    }

    public Session endDate(ZonedDateTime endDate) {
        this.endDate = endDate;
        return this;
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate;
    }

    public String getExtId() {
        return extId;
    }

    public Session extId(String extId) {
        this.extId = extId;
        return this;
    }

    public void setExtId(String extId) {
        this.extId = extId;
    }

    public String getPoRoot() {
        return poRoot;
    }

    public Session poRoot(String poRoot) {
        this.poRoot = poRoot;
        return this;
    }

    public void setPoRoot(String poRoot) {
        this.poRoot = poRoot;
    }

    public Boolean isElaborated() {
        return elaborated;
    }

    public Session elaborated(Boolean elaborated) {
        this.elaborated = elaborated;
        return this;
    }

    public void setElaborated(Boolean elaborated) {
        this.elaborated = elaborated;
    }

    public Set<Match> getMatches() {
        return matches;
    }

    public Session matches(Set<Match> matches) {
        this.matches = matches;
        return this;
    }

    public Session addMatches(Match match) {
        this.matches.add(match);
        match.setSession(this);
        return this;
    }

    public Session removeMatches(Match match) {
        this.matches.remove(match);
        match.setSession(null);
        return this;
    }

    public void setMatches(Set<Match> matches) {
        this.matches = matches;
    }

    public Game getGame() {
        return game;
    }

    public Session game(Game game) {
        this.game = game;
        return this;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Session session = (Session) o;
        if (session.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), session.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Session{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", extId='" + getExtId() + "'" +
            ", poRoot='" + getPoRoot() + "'" +
            ", elaborated='" + isElaborated() + "'" +
            "}";
    }
}
