package cc.officina.gatorade.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Attempt.
 */
@Entity
@Table(name = "attempt")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Attempt implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "attempt_score")
    private Long attemptScore;

    @Column(name = "start_attempt")
    private ZonedDateTime startAttempt;

    @Column(name = "stop_attempt")
    private ZonedDateTime stopAttempt;

    @Column(name = "level_reached")
    private String levelReached;

    @Column(name = "last_update")
    private ZonedDateTime lastUpdate;

    @Column(name = "cancelled")
    private Boolean cancelled;

    @Column(name = "completed")
    private Boolean completed;
    
    @ManyToOne
    @JsonIgnore
    private Match match;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAttemptScore() {
        return attemptScore;
    }

    public Attempt attemptScore(Long attemptScore) {
        this.attemptScore = attemptScore;
        return this;
    }

    public void setAttemptScore(Long attemptScore) {
        this.attemptScore = attemptScore;
    }

    public ZonedDateTime getStartAttempt() {
        return startAttempt;
    }

    public Attempt startAttempt(ZonedDateTime startAttempt) {
        this.startAttempt = startAttempt;
        return this;
    }

    public void setStartAttempt(ZonedDateTime startAttempt) {
        this.startAttempt = startAttempt;
    }

    public ZonedDateTime getStopAttempt() {
        return stopAttempt;
    }

    public Attempt stopAttempt(ZonedDateTime stopAttempt) {
        this.stopAttempt = stopAttempt;
        return this;
    }

    public void setStopAttempt(ZonedDateTime stopAttempt) {
        this.stopAttempt = stopAttempt;
    }

    public String getLevelReached() {
        return levelReached;
    }

    public Attempt levelReached(String levelReached) {
        this.levelReached = levelReached;
        return this;
    }

    public void setLevelReached(String levelReached) {
        this.levelReached = levelReached;
    }

    public ZonedDateTime getLastUpdate() {
        return lastUpdate;
    }

    public Attempt lastUpdate(ZonedDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
        return this;
    }

    public void setLastUpdate(ZonedDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }

    public Boolean isCancelled() {
        return cancelled;
    }

    public Attempt cancelled(Boolean cancelled) {
        this.cancelled = cancelled;
        return this;
    }

    public void setCancelled(Boolean cancelled) {
        this.cancelled = cancelled;
    }

    public Boolean isCompleted() {
        return completed;
    }

    public Attempt completed(Boolean completed) {
        this.completed = completed;
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Match getMatch() {
        return match;
    }

    public Attempt match(Match match) {
        this.match = match;
        return this;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Attempt attempt = (Attempt) o;
        if (attempt.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), attempt.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Attempt{" +
            "id=" + getId() +
            ", attemptScore='" + getAttemptScore() + "'" +
            ", startAttempt='" + getStartAttempt() + "'" +
            ", stopAttempt='" + getStopAttempt() + "'" +
            ", levelReached='" + getLevelReached() + "'" +
            ", lastUpdate='" + getLastUpdate() + "'" +
            ", cancelled='" + isCancelled() + "'" +
            ", completed='" + isCompleted() + "'" +
            "}";
    }
}
