package cc.officina.gatorade.repository;

import cc.officina.gatorade.domain.MatchTemplate;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


/**
 * Spring Data JPA repository for the MatchTemplate entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatchTemplateRepository extends JpaRepository<MatchTemplate,Long> {

	@Query("select m from MatchTemplate m where m.game.id = :gameId")
	public MatchTemplate findOneByGameId(@Param("gameId")Long gameId);
    
}
