package cc.officina.gatorade.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Game.
 */
@Entity
@Table(name = "game")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Game implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "url")
    private String url;

    @Column(name = "code")
    private String code;

    @Column(name = "action_id")
    private String actionId;

    @Column(name = "jhi_type")
    private GameType type;

    @Column(name = "use_levels")
    private Boolean useLevels;

    @Column(name = "levels_number")
    private Long levelsNumber;

    @Column(name = "last_attempt_valid")
    private Boolean lastAttemptValid;

    @OneToMany(mappedBy = "game")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Match> matches = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public Game description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return url;
    }

    public Game url(String url) {
        this.url = url;
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCode() {
        return code;
    }

    public Game code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getActionId() {
        return actionId;
    }

    public Game actionId(String actionId) {
        this.actionId = actionId;
        return this;
    }

    public void setActionId(String actionId) {
        this.actionId = actionId;
    }

    public GameType getType() {
        return type;
    }

    public Game type(GameType type) {
        this.type = type;
        return this;
    }

    public void setType(GameType type) {
        this.type = type;
    }

    public Boolean isUseLevels() {
        return useLevels;
    }

    public Game useLevels(Boolean useLevels) {
        this.useLevels = useLevels;
        return this;
    }

    public void setUseLevels(Boolean useLevels) {
        this.useLevels = useLevels;
    }

    public Long getLevelsNumber() {
        return levelsNumber;
    }

    public Game levelsNumber(Long levelsNumber) {
        this.levelsNumber = levelsNumber;
        return this;
    }

    public void setLevelsNumber(Long levelsNumber) {
        this.levelsNumber = levelsNumber;
    }

    public Boolean isLastAttemptValid() {
        return lastAttemptValid;
    }

    public Game lastAttemptValid(Boolean lastAttemptValid) {
        this.lastAttemptValid = lastAttemptValid;
        return this;
    }

    public void setLastAttemptValid(Boolean lastAttemptValid) {
        this.lastAttemptValid = lastAttemptValid;
    }

    public Set<Match> getMatches() {
        return matches;
    }

    public Game matches(Set<Match> matches) {
        this.matches = matches;
        return this;
    }

    public Game addMatches(Match match) {
        this.matches.add(match);
        match.setGame(this);
        return this;
    }

    public Game removeMatches(Match match) {
        this.matches.remove(match);
        match.setGame(null);
        return this;
    }

    public void setMatches(Set<Match> matches) {
        this.matches = matches;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Game game = (Game) o;
        if (game.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), game.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Game{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", url='" + getUrl() + "'" +
            ", code='" + getCode() + "'" +
            ", actionId='" + getActionId() + "'" +
            ", type='" + getType() + "'" +
            ", useLevels='" + isUseLevels() + "'" +
            ", levelsNumber='" + getLevelsNumber() + "'" +
            ", lastAttemptValid='" + isLastAttemptValid() + "'" +
            "}";
    }
}
