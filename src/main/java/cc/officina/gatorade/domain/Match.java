package cc.officina.gatorade.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import cc.officina.gatorade.service.impl.GamificationServiceImpl;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Match.
 */
@Entity
@Table(name = "match")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Match implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "jhi_start")
    private ZonedDateTime start;

    @Column(name = "jhi_stop")
    private ZonedDateTime stop;

    @Column(name = "diff_level")
    private Long diffLevel;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "last_start")
    private ZonedDateTime lastStart;

    @Column(name = "time_spent")
    private Long timeSpent;

    @ManyToOne
    private Game game;

    @ManyToOne
    private MatchTemplate template;

    @OneToMany(mappedBy = "match", fetch = FetchType.EAGER)
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONE)
    private Set<Attempt> attempts = new HashSet<>();

    @ManyToOne
    private Session session;
    
    @Column(name = "elaborated")
    private boolean elaborated;
    
    @Column(name = "match_token")
    private Long matchToken;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getStart() {
        return start;
    }

    public Match start(ZonedDateTime start) {
        this.start = start;
        return this;
    }

    public void setStart(ZonedDateTime start) {
        this.start = start;
    }

    public ZonedDateTime getStop() {
        return stop;
    }

    public Match stop(ZonedDateTime stop) {
        this.stop = stop;
        return this;
    }

    public void setStop(ZonedDateTime stop) {
        this.stop = stop;
    }

    public Long getDiffLevel() {
        return diffLevel;
    }

    public Match diffLevel(Long diffLevel) {
        this.diffLevel = diffLevel;
        return this;
    }

    public void setDiffLevel(Long diffLevel) {
        this.diffLevel = diffLevel;
    }

    public String getUserId() {
        return userId;
    }

    public Match userId(String userId) {
        this.userId = userId;
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public ZonedDateTime getLastStart() {
        return lastStart;
    }

    public Match lastStart(ZonedDateTime lastStart) {
        this.lastStart = lastStart;
        return this;
    }

    public void setLastStart(ZonedDateTime lastStart) {
        this.lastStart = lastStart;
    }

    public Long getTimeSpent() {
        return timeSpent;
    }

    public Match timeSpent(Long timeSpent) {
        this.timeSpent = timeSpent;
        return this;
    }

    public void setTimeSpent(Long timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Game getGame() {
        return game;
    }

    public Match game(Game game) {
        this.game = game;
        return this;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public MatchTemplate getTemplate() {
        return template;
    }

    public Match template(MatchTemplate matchTemplate) {
        this.template = matchTemplate;
        return this;
    }

    public void setTemplate(MatchTemplate matchTemplate) {
        this.template = matchTemplate;
    }

    public Set<Attempt> getAttempts() {
        return attempts;
    }

    public Match attempts(Set<Attempt> attempts) {
        this.attempts = attempts;
        return this;
    }

    public Match addAttempts(Attempt attempt) {
        this.attempts.add(attempt);
        attempt.setMatch(this);
        return this;
    }

    public Match removeAttempts(Attempt attempt) {
        this.attempts.remove(attempt);
        attempt.setMatch(null);
        return this;
    }

    public void setAttempts(Set<Attempt> attempts) {
        this.attempts = attempts;
    }

    public Session getSession() {
        return session;
    }

    public Match session(Session session) {
        this.session = session;
        return this;
    }

    public void setSession(Session session) {
        this.session = session;
    }
    
    public boolean isElaborated() {
		return elaborated;
	}

	public void setElaborated(boolean elaborated) {
		this.elaborated = elaborated;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Long getMatchToken() {
		return matchToken;
	}

	public void setMatchToken(Long matchToken) {
		this.matchToken = matchToken;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Match match = (Match) o;
        if (match.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), match.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Match{" +
            "id=" + getId() +
            ", start='" + getStart() + "'" +
            ", stop='" + getStop() + "'" +
            ", diffLevel='" + getDiffLevel() + "'" +
            ", userId='" + getUserId() + "'" +
            ", lastStart='" + getLastStart() + "'" +
            ", timeSpent='" + getTimeSpent() + "'" +
            "}";
    }

	public String getMaxScore() {
		Long max = 0l;
		for(Attempt a : this.getAttempts())
		{
			if(a.getAttemptScore() > max)
				max = a.getAttemptScore();
		}
		return max.toString();
	}

	public String getMeanScore() {
		if(this.getAttempts().size() == 0)
			return 0+"";
		Long mean = 0l;
		for(Attempt a : this.getAttempts())
		{
			mean = mean + a.getAttemptScore();
		}
		mean = mean / this.getAttempts().size();
		return mean.toString();
	}

	@JsonIgnore
	public String getMaxLevel() {
		Long max = 0l;
		for(Attempt a : this.getAttempts())
		{
			try
			{
				if(a != null && a.getLevelReached() != null && Long.parseLong(a.getLevelReached()) > max)
					max = Long.parseLong(a.getLevelReached());
			}
			catch(Exception e)
			{
				System.out.println("Errore nel calcolo del maxLevel: " + e.getMessage());
			}
		}
		return max.toString();
	}
}
