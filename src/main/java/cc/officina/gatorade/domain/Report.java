package cc.officina.gatorade.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import cc.officina.gatorade.domain.enumeration.ReportType;

/**
 * A Report.
 */
@Entity
@Table(name = "report")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Report implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "userid")
    private String userid;

    @Column(name = "jhi_timestamp")
    private ZonedDateTime timestamp;

    @Column(name = "json")
    private String json;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_type")
    private ReportType type;

    @Column(name = "match_id")
    private Long match_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserid() {
        return userid;
    }

    public Report userid(String userid) {
        this.userid = userid;
        return this;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public Report timestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
        return this;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getJson() {
        return json;
    }

    public Report json(String json) {
        this.json = json;
        return this;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public ReportType getType() {
        return type;
    }

    public Report type(ReportType type) {
        this.type = type;
        return this;
    }

    public void setType(ReportType type) {
        this.type = type;
    }

    public Long getMatch_id() {
        return match_id;
    }

    public Report match_id(Long match_id) {
        this.match_id = match_id;
        return this;
    }

    public void setMatch_id(Long match_id) {
        this.match_id = match_id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Report report = (Report) o;
        if (report.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), report.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Report{" +
            "id=" + getId() +
            ", userid='" + getUserid() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            ", json='" + getJson() + "'" +
            ", type='" + getType() + "'" +
            ", match_id='" + getMatch_id() + "'" +
            "}";
    }
}
