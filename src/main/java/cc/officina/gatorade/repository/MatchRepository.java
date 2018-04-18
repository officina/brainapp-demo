package cc.officina.gatorade.repository;

import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the Match entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    @Query("select m from Match m where m.game.id = :gameId and m.template.id=:templateId and lower(m.userId)=lower(:playerId) and m.session.id=:sessionid and m.valid = true")
    public Match findOneByPlayerAndSession(@Param("gameId")Long gameId, @Param("templateId")Long templateId, @Param("playerId")String playerId, @Param("sessionid")Long sessionId);

    @Query("select m from Match m where m.session.extId=:extId")
    public List<Match> findUserByExtId(@Param("extId")String extId);

    @Query("select m from Match m where m.session.id=:sessionId and m.userId = :userId")
    public List<Match> findByUserAndSessionId(@Param("userId")String userId, @Param("sessionId")Long sessionId);

    @Query("select m from Match m where m.userId = :userId and m.valid = true")
    public List<Match> findValidByUser(@Param("userId")String userId);
}
