package cc.officina.brainapp.service;

import cc.officina.brainapp.domain.Match;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing Match.
 */
public interface MatchService {

    /**
     * Save a match.
     *
     * @param match the entity to save
     * @return the persisted entity
     */
    Match save(Match match);

    /**
     *  Get all the matches.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Match> findAll(Pageable pageable);

    /**
     *  Get the "id" match.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Match findOne(Long id);

    /**
     *  Delete the "id" match.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);
}
