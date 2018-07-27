package cc.officina.gatorade.repository;

import cc.officina.gatorade.domain.Match;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the Match entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatchRepository extends JpaRepository<Match,Long> {


	@Query("select m from Match m where m.game.id = :gameId and m.template.id=:templateId and lower(m.userId)=lower(:playerId) and m.session.id=:sessionid and m.valid = true")
	public Match findOneByPlayerAndSession(@Param("gameId")Long gameId, @Param("templateId")Long templateId, @Param("playerId")String playerId, @Param("sessionid")Long sessionId);

	@Query("select m from Match m where m.session.extId=:extId")
	public List<Match> findUserByExtId(@Param("extId")String extId);

	@Query("select m from Match m where m.session.id=:sessionId and m.userId = :userId")
	public List<Match> findByUserAndSessionId(@Param("userId")String userId, @Param("sessionId")Long sessionId);

	@Query("select m from Match m where m.userId = :userId and m.valid = true and m.matchToken > -1 and m.anomalous = false and m.stop is not null")
	public List<Match> findValidByUserId(@Param("userId")String userId);

	@Modifying
	@Query("update Match m set m.valid = false where m.userId = :userId")
	public void invalidateByUserId(@Param("userId")String userId);

	@Query("select m from Match m where (m.sendToPo = false or m.elaborated = false) and m.matchToken > -1 and m.retry < :maxRetry and m.anomalous = false")
	public List<Match> fetchPendingMatches(@Param("maxRetry")Long maxRetry);

	@Query("select m from Match m where m.session.id = :sessionId and m.valid = true and m.matchToken > -1 order by m.start desc")
    public List<Match> findValidBySessionId(@Param("sessionId")Long sessionId);

    @Query("select m from Match m where m.session.id = :sessionId and m.valid = true and m.matchToken > -1 order by m.start desc")
    public Page<Match> findValidBySessionId(Pageable pageable, @Param("sessionId")Long sessionId);

    @Query("select m from Match m where m.game.id = :gameId and m.userId = :playerId and m.replayState = 1 and m.valid = true") //1 = Main
	public Match findMainMatch(@Param("gameId")Long gameId, @Param("playerId")String playerId);

    @Query("select m from Match m where m.userId = :playerid and m.session.id = :sessionid and valid = true")
    public Match findResettableMatchBySessionidAndPlayerid(@Param("sessionid") Long sessionid, @Param("playerid")String playerid);

    @Query("select m from Match m where m.userId = :playerid and m.session.id = :sessionid and m.elaborated = false and m.anomalous = true and m.valid = true")
    public Match findComplitableMatchBySessionidAndPlayerid(@Param("sessionid") Long sessionid, @Param("playerid")String playerid);
}
