package cc.officina.gatorade.service;

import cc.officina.gatorade.domain.Session;
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

	public boolean validateSessionAndUser(Long extid, String playerid);

	public Session findOneByExtId(Long sessionid);
}
