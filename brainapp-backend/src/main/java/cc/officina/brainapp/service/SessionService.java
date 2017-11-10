package cc.officina.brainapp.service;

import cc.officina.brainapp.domain.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing Session.
 */
public interface SessionService {

    /**
     * Save a session.
     *
     * @param session the entity to save
     * @return the persisted entity
     */
    Session save(Session session);

    /**
     *  Get all the sessions.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Session> findAll(Pageable pageable);

    /**
     *  Get the "id" session.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Session findOne(Long id);

    /**
     *  Delete the "id" session.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);
}
