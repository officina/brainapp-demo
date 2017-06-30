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
    
    @ManyToOne
    private Game game;

    @ManyToOne
    private MatchTemplate template;

    @OneToMany(mappedBy = "match")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Attempt> attempts = new HashSet<>();

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
            "}";
    }
}
