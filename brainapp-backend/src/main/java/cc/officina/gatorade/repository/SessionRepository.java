package cc.officina.gatorade.repository;

import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Session;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the Session entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    @Query("select s from Session s where s.extId = :extid")
    public Session findByExtId(@Param("extid")String extid);

    @Query("select s from Session s where s.extId = :extid and s.game.id = :gameid")
    public Session findByExtId(@Param("extid")String extid, @Param("gameid")Long gameid);

    @Query("select s from Session s where s.id = :sessionId and s.endDate > :now and s.startDate < :now and s.game.id = :gameid and s.elaborated = false")
    public Session findValidById(@Param("sessionId")Long sessionId, @Param("now")ZonedDateTime now, @Param("gameid") Long gameid);

    @Query("select s from Session s where s.elaborated = false and s.endDate < :now")
    public List<Session> findPendingSessions(@Param("now")ZonedDateTime now);

    @Query("select s from Session s where s.poRoot = :labId")
    public List<Session> findAllByLabId(@Param("labId")String labId);

    @Query("select s from Session s where s.id in (select session.id from Match where userId = :userId) order by s.endDate asc")
    public List<Session> findAllByUserId(@Param("userId")String userId);

    @Query("select s from Session s where s.id in (select session.id from Match where userId = :userId) and s.endDate >= :now and s.startDate <= :now order by s.endDate asc")
    public List<Session> findAllActiveByUserId(@Param("userId")String userId, @Param("now")ZonedDateTime now);
}
