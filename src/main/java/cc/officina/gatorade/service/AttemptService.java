package cc.officina.gatorade.service;

import cc.officina.gatorade.domain.Attempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing Attempt.
 */
public interface AttemptService {

    /**
     * Save a attempt.
     *
     * @param attempt the entity to save
     * @return the persisted entity
     */
    Attempt save(Attempt attempt);

    /**
     *  Get all the attempts.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Attempt> findAll(Pageable pageable);

    /**
     *  Get the "id" attempt.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Attempt findOne(Long id);

    /**
     *  Delete the "id" attempt.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);

    /**
     *  Get the "localId" attempt
     * @param localId local id
     * @return the attempt
     */
    Attempt findOneByLocalId(Long localId);
}
