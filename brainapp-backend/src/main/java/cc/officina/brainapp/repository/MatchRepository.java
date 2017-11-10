package cc.officina.brainapp.repository;

import cc.officina.brainapp.domain.Match;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Match entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

}
