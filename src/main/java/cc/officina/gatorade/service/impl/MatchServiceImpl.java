package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.MatchService;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.repository.MatchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing Match.
 */
@Service
@Transactional
public class MatchServiceImpl implements MatchService{

    private final Logger log = LoggerFactory.getLogger(MatchServiceImpl.class);

    private final MatchRepository matchRepository;

    public MatchServiceImpl(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    /**
     * Save a match.
     *
     * @param match the entity to save
     * @return the persisted entity
     */
    @Override
    public Match save(Match match) {
        log.debug("Request to save Match : {}", match);
        return matchRepository.save(match);
    }

    /**
     *  Get all the matches.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Match> findAll(Pageable pageable) {
        log.debug("Request to get all Matches");
        return matchRepository.findAll(pageable);
    }

    /**
     *  Get one match by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Match findOne(Long id) {
        log.debug("Request to get Match : {}", id);
        return matchRepository.findOne(id);
    }

    /**
     *  Delete the  match by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Match : {}", id);
        matchRepository.delete(id);
    }
}
