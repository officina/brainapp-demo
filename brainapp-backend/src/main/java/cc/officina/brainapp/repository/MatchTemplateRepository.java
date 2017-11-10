package cc.officina.brainapp.repository;

import cc.officina.brainapp.domain.MatchTemplate;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the MatchTemplate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatchTemplateRepository extends JpaRepository<MatchTemplate, Long> {

}
