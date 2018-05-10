package cc.officina.gatorade.domain;

import cc.officina.gatorade.domain.enumeration.MatchReplayState;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @Column(name = "used_to_po")
    private Boolean usedToPO;

    @Column(name = "elaborated")
    private Boolean elaborated;

    @Column(name = "match_token")
    private Long matchToken;

    @Column(name = "valid")
    private Boolean valid;

    @Column(name = "best_level")
    private String bestLevel;

    @Column(name = "best_score")
    private Long bestScore;

    @Column(name = "send_to_po")
    private Boolean sendToPo = false;

    @ManyToOne
    private Game game;

    @ManyToOne
    private MatchTemplate template;

    @OneToMany(mappedBy = "match")
    @JsonIgnore
    private Set<Attempt> attempts = new HashSet<>();

    @ManyToOne
    private Session session;

    @Column(name = "retry")
    private Long retry = 0l;

    @Column(name = "anomalous")
    private Boolean anomalous = false;

    @Column(name = "replay_state")
    private MatchReplayState replayState;

    @Column(name = "parent_id")
    private Long parentId;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
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

    public Boolean isUsedToPO() {
        return usedToPO;
    }

    public Match usedToPO(Boolean usedToPO) {
        this.usedToPO = usedToPO;
        return this;
    }

    public void setUsedToPO(Boolean usedToPO) {
        this.usedToPO = usedToPO;
    }

    public Boolean isElaborated() {
        return elaborated;
    }

    public Match elaborated(Boolean elaborated) {
        this.elaborated = elaborated;
        return this;
    }

    public void setElaborated(Boolean elaborated) {
        this.elaborated = elaborated;
    }

    public Long getMatchToken() {
        return matchToken;
    }

    public Match matchToken(Long matchToken) {
        this.matchToken = matchToken;
        return this;
    }

    public void setMatchToken(Long matchToken) {
        this.matchToken = matchToken;
    }

    public Boolean isValid() {
        return valid;
    }

    public Match valid(Boolean valid) {
        this.valid = valid;
        return this;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
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

    public Boolean getSendToPo()
	{
		return sendToPo;
	}

	public void setSendToPo(Boolean sendToPo)
	{
		this.sendToPo = sendToPo;
	}

	public Boolean getUsedToPO()
	{
		return usedToPO;
	}

	public Boolean getElaborated()
	{
		return elaborated;
	}

	public Boolean getValid()
	{
		return valid;
	}

	public Long getRetry()
	{
		return retry;
	}

	public void setRetry(Long retry)
	{
		this.retry = retry;
	}

	public Boolean isAnomalous()
	{
		return anomalous;
	}

	public void setAnomalous(Boolean anomalous)
	{
		this.anomalous = anomalous;
	}

    public MatchReplayState getReplayState() {
        return replayState;
    }

    public void setReplayState(MatchReplayState replayState) {
        this.replayState = replayState;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
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
            ", diffLevel=" + getDiffLevel() +
            ", userId='" + getUserId() + "'" +
            ", lastStart='" + getLastStart() + "'" +
            ", timeSpent=" + getTimeSpent() +
            ", usedToPO='" + isUsedToPO() + "'" +
            ", elaborated='" + isElaborated() + "'" +
            ", matchToken=" + getMatchToken() +
            ", valid='" + isValid() + "'" +
            ", bestLevel='"+ getBestLevel() + "'" +
            ", bestScore='"+ getBestScore() + "'" +
            ", sendToPo='"+ getSendToPo() + "'" +
            ", anomalous='"+ isAnomalous() + "'" +
            ", retry='"+ getRetry() + "'" +
            "}";
    }

    @JsonIgnore
    public String getMaxScore() {
        Long max = 0l;
        for(Attempt a : this.getAttempts())
        {
            if((a.isCompleted() || this.game.isLastAttemptValid()) && a.getAttemptScore() != null && (a.getAttemptScore() > max))
                max = a.getAttemptScore();
        }
        //nel caso di max_score un attempt a zero e un match con tutti 0 è considerato valido
        if(max == null)
            return null;
        else
            return max.toString();
    }

    @JsonIgnore
    public String getMinScore() {
        Long min = null;
        for(Attempt a : this.attempts)
        {
            try
            {
                if((a.isCompleted() || this.game.isLastAttemptValid()) && (min == null || a.getAttemptScore() < min && a.getAttemptScore()!=0l))
                    min = a.getAttemptScore();
            }
            catch (Exception e)
            {
                e.getMessage();
            }
        }
        if(min == null)
            return null;
        else
            return min.toString();
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

/*
    public String getMinScore() {
        Long min = null;
        for(Attempt a : this.getAttempts())
        {

            if(a.isCompleted() && (min == null || a.getAttemptScore() < min))
                min = a.getAttemptScore();
        }
        if(min == null)
            min = 0l;
        return min.toString();
    }
*/

    @JsonIgnore
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

    @JsonIgnore
    public ZonedDateTime getFirstStartAttempt() {
    	ZonedDateTime result = null;
    	for(Attempt a : this.getAttempts())
    	{
    		if(result == null || a.getStartAttempt().isBefore(result))
    			result = a.getStartAttempt();
    	}
    	return result;
    }
}
