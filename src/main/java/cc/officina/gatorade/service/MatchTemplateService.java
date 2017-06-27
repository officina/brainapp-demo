package cc.officina.gatorade.service;

import cc.officina.gatorade.domain.MatchTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing MatchTemplate.
 */
public interface MatchTemplateService {

    /**
     * Save a matchTemplate.
     *
     * @param matchTemplate the entity to save
     * @return the persisted entity
     */
    MatchTemplate save(MatchTemplate matchTemplate);

    /**
     *  Get all the matchTemplates.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<MatchTemplate> findAll(Pageable pageable);

    /**
     *  Get the "id" matchTemplate.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    MatchTemplate findOne(Long id);

    /**
     *  Delete the "id" matchTemplate.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);
}
