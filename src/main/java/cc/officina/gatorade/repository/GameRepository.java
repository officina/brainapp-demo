package cc.officina.gatorade.repository;

import cc.officina.gatorade.domain.Game;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Game entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GameRepository extends JpaRepository<Game,Long> {
    
}
