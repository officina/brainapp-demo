package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.domain.Match;
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

    public AttemptServiceImpl(AttemptRepository attemptRepository) {
        this.attemptRepository = attemptRepository;
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
    public Attempt syncAttempt(Long id, Long localId, Long score, String level, Match match) {
        Attempt attempt;
        if (id != null){
            //attempt creato "online"
            attempt = attemptRepository.findOne(id);
            attempt.setLevelReached(level);
            attempt.setAttemptScore(score);
        }else{
            //Cerco un attempt creato "offline" che sia già stato creato su gatorade
            attempt = attemptRepository.getOneByLocalId(localId);
            if (attempt == null){
                //attempt creato "offline" e non ancora salvato su gatorade
                attempt = new Attempt();
                attempt.setLocalId(localId);
                attempt.setMatch(match);
                attempt.setAttemptScore(score);
                attempt.setLevelReached(level);
                attempt.setCompleted(false);
                attempt.setCancelled(false);
                attempt.setValid(true);
            }else{
                attempt.setLevelReached(level);
                attempt.setAttemptScore(score);
            }
        }
        attemptRepository.save(attempt);
        return attempt;
    }
}
