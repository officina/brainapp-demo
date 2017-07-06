package cc.officina.gatorade.repository;

import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Session;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the Session entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SessionRepository extends JpaRepository<Session,Long> {
	
	@Query("select s from Session s where s.extId = :extid")
	public Session findByExtId(@Param("extid")Long extid);

}
