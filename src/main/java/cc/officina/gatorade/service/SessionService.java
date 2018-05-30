package cc.officina.gatorade.service;

import cc.officina.gatorade.domain.Game;
import cc.officina.gatorade.domain.Session;
import cc.officina.gatorade.service.dto.SessionDTO;

import java.time.ZonedDateTime;
import java.util.List;

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

	public boolean validateSessionAndUser(Long sessionId, String playerid, Long gameid);

	public Session findOneByExtId(String extid);

	public Session findOneByExtId(String extid, Long gameid);

	public Session saveAndSchedule(Game game, Session session);

	public void elaborate(Session session);

	public List<Session> findPending(ZonedDateTime now);

    /**
     * Find all {@link Session} matching the given {@code labId}
     * @param labId id of the lab
     * @return a list of {@link Session}
     */
    List<Session> findAllByLabId(String labId);

	public void rielaborate(Session session);

	public List<SessionDTO> getUserLabsSession(String userId, List<String> labs, Boolean active);

	public List<Session> getSessionsByLabs(List<String> labs, Boolean active);

    List<Session> findAllByUserId(String userId, Boolean active);

    List<SessionDTO> mapSessionsToDTOS(List<Session> sessions);

    List<SessionDTO> setValidMatchToSessionDtos(String userId, List<SessionDTO> sessionDtos);
}
