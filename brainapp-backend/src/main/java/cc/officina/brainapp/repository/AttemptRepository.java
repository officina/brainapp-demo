package cc.officina.brainapp.repository;

import cc.officina.brainapp.domain.Attempt;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Attempt entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {

}