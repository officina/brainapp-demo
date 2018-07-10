package cc.officina.gatorade.service;

import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.Report;
import cc.officina.gatorade.service.impl.MatchServiceImpl.TypeOfStillPending;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

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

    /**
     * Find Matches by user id and session id
     * @param userId id of the user
     * @param id id of the session
     * @return list of matches
     */
    public List<Match> findByUserAndId(String userId, Long id);

	public Match resetMatch(Match match);

    /**
     * Find valid Match matching the given user id
     * @param userId id of the user
     * @return list of valid match for the user
     */
	public List<Match> getMatchesByUserId(String userId);

	public void deletePlayerActivities(String userId);
	public void matchesRestore();
	public TypeOfStillPending singleMatchRestore(Match match);
	public List<Match> findValidBySessionId(Long sessionId);
    public Page<Match> findValidBySessionId(Pageable pageable, Long sessionId);
	public Match findMainMatch(Long gameId, String userId);
	public Match adminElaborateMatch(Match match);
    public Match adminCloseMatch(Match match);
    public Match restartMatch(Long sessionid, String playerid);
    public Match completeMatch(Long sessionid, String playerid);
    public Match findMatchAppeso(Long sessionid, String playerid);
}
