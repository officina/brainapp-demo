package cc.officina.gatorade.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A MatchTemplate.
 */
@Entity
@Table(name = "match_template")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class MatchTemplate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "max_duration")
    private Long maxDuration;

    @Column(name = "max_attempt")
    private Long maxAttempt;

    @Column(name = "description")
    private String description;

    @Column(name = "custom")
    private Boolean custom;

    @ManyToOne
    private Game game;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMaxDuration() {
        return maxDuration;
    }

    public MatchTemplate maxDuration(Long maxDuration) {
        this.maxDuration = maxDuration;
        return this;
    }

    public void setMaxDuration(Long maxDuration) {
        this.maxDuration = maxDuration;
    }

    public Long getMaxAttempt() {
        return maxAttempt;
    }

    public MatchTemplate maxAttempt(Long maxAttempt) {
        this.maxAttempt = maxAttempt;
        return this;
    }

    public void setMaxAttempt(Long maxAttempt) {
        this.maxAttempt = maxAttempt;
    }

    public String getDescription() {
        return description;
    }

    public MatchTemplate description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean isCustom() {
        return custom;
    }

    public MatchTemplate custom(Boolean custom) {
        this.custom = custom;
        return this;
    }

    public void setCustom(Boolean custom) {
        this.custom = custom;
    }

    public Game getGame() {
        return game;
    }

    public MatchTemplate game(Game game) {
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
        MatchTemplate matchTemplate = (MatchTemplate) o;
        if (matchTemplate.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), matchTemplate.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MatchTemplate{" +
            "id=" + getId() +
            ", maxDuration='" + getMaxDuration() + "'" +
            ", maxAttempt='" + getMaxAttempt() + "'" +
            ", description='" + getDescription() + "'" +
            ", custom='" + isCustom() + "'" +
            "}";
    }
}
