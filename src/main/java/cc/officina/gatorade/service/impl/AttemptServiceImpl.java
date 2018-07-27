package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.domain.GameType;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.enumeration.AttemptSyncState;
import cc.officina.gatorade.repository.MatchRepository;
import cc.officina.gatorade.service.AttemptService;
import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.repository.AttemptRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing Attempt.
 */
@Service
@Transactional
public class AttemptServiceImpl implements AttemptService{

    private final Logger log = LoggerFactory.getLogger(AttemptServiceImpl.class);

    private final AttemptRepository attemptRepository;
    private final MatchRepository matchRepository;

    public AttemptServiceImpl(AttemptRepository attemptRepository, MatchRepository matchRepository) {
        this.attemptRepository = attemptRepository;
        this.matchRepository = matchRepository;
    }

    /**
     * Save a attempt.
     *
     * @param attempt the entity to save
     * @return the persisted entity
     */
    @Override
    public Attempt save(Attempt attempt) {
        log.debug("Request to save Attempt : {}", attempt);
        return attemptRepository.save(attempt);
    }

    /**
     *  Get all the attempts.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Attempt> findAll(Pageable pageable) {
        log.debug("Request to get all Attempts");
        return attemptRepository.findAll(pageable);
    }

    /**
     *  Get one attempt by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Attempt findOne(Long id) {
        log.debug("Request to get Attempt : {}", id);
        return attemptRepository.findOne(id);
    }

    /**
     *  Delete the  attempt by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Attempt : {}", id);
        attemptRepository.delete(id);
    }

    /**
     * Get one attempt by localId.
     * @param localId local id
     * @return one attempt
     */
    @Override
    public Attempt findOneByLocalId(Long localId) {
        log.debug("Request to get Attempt for localId: {}", localId);
        return attemptRepository.getOneByLocalId(localId);
    }

    @Override
    public Attempt syncAttempt(Attempt reqAttempt, Match match, AttemptSyncState syncState) {
        Attempt attempt;
        Long origScore = null;
        String origLevel = null;
        if (reqAttempt.getId() != null){
            //attempt creato "online"
            attempt = attemptRepository.findOne(reqAttempt.getId());
            origLevel = attempt.getLevelReached();
            origScore = attempt.getAttemptScore();
            if (attempt.getStopAttempt() == null){
                match.manageAFK(attempt.getLevelReached(), attempt.getAttemptScore(), reqAttempt.getLevelReached(), reqAttempt.getAttemptScore());
            }
            if (match.getGame().getType() == GameType.MINPOINT){
                if (reqAttempt.getAttemptScore() < origScore && reqAttempt.getAttemptScore() != 0){
                    attempt.setAttemptScore(reqAttempt.getAttemptScore());
                }
            }else{
                if (reqAttempt.getAttemptScore() > origScore){
                    attempt.setAttemptScore(reqAttempt.getAttemptScore());
                }
            }
            attempt.setLevelReached(reqAttempt.getLevelReached());
        }else{
            //Cerco un attempt creato "offline" che sia già stato creato su gatorade
            attempt = attemptRepository.getOneByLocalId(reqAttempt.getLocalId());
            if (attempt == null){
                //attempt creato "offline" e non ancora salvato su gatorade
                attempt = new Attempt();
                attempt.setLocalId(reqAttempt.getLocalId());
                attempt.setMatch(match);
                attempt.setAttemptScore(reqAttempt.getAttemptScore());
                attempt.setLevelReached(reqAttempt.getLevelReached());
                attempt.setCompleted(reqAttempt.getCompleted());
                attempt.setStartAttempt(reqAttempt.getStartAttempt());
                attempt.setLastUpdate(reqAttempt.getLastUpdate());
                attempt.setCancelled(false);
                attempt.setValid(true);
            }else{
                origLevel = attempt.getLevelReached();
                origScore = attempt.getAttemptScore();
                if (attempt.getStopAttempt() == null){
                    match.manageAFK(attempt.getLevelReached(), attempt.getAttemptScore(), reqAttempt.getLevelReached(), reqAttempt.getAttemptScore());
                }
                if (match.getGame().getType() == GameType.MINPOINT){
                    if (reqAttempt.getAttemptScore() < origScore && reqAttempt.getAttemptScore() != 0){
                        attempt.setAttemptScore(reqAttempt.getAttemptScore());
                    }
                }else{
                    if (reqAttempt.getAttemptScore() > origScore){
                        attempt.setAttemptScore(reqAttempt.getAttemptScore());
                    }
                }
                attempt.setLevelReached(reqAttempt.getLevelReached());
            }
        }
        attempt.setSync(syncState);
        attemptRepository.save(attempt);
        matchRepository.save(match);
        log.info("Attempt: "+attempt.getId()+" from Match id: "+match.getId()+" - SyncState: "+syncState.name());
        log.debug("SyncAttempt for attempt "+attempt.getId()+": for Original score: "+origScore+" - Updated score: "+attempt.getAttemptScore()+" - Original level: "+origLevel+" - Updated level: "+attempt.getLevelReached());
        return attempt;
    }
}
