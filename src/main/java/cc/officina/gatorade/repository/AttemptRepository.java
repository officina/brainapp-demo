package cc.officina.gatorade.repository;

import cc.officina.gatorade.domain.Attempt;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the Attempt entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttemptRepository extends JpaRepository<Attempt,Long> {

	@Modifying
	@Query("update Attempt a set a.valid = false where a.match.id in (select m.id from Match m where m.userId = :userId)")
	public void invalidateByUserId(@Param("userId")String userId);

	@Query("select a from Attempt a where a.localId = :localId")
    public Attempt getOneByLocalId(@Param("localId")Long localId);

	@Query("select a from Attempt a where a.stopAttempt = (select max(aa.stopAttempt) from Attempt aa where aa.match.id = :matchId)")
	public Attempt getLastFinished(@Param("matchId")Long matchId);

}
