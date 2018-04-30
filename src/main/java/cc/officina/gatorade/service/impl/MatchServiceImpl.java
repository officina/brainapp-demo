package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GameService;
import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.service.MatchService;
import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Match;
import cc.officina.gatorade.domain.MatchTemplate;
import cc.officina.gatorade.repository.AttemptRepository;
import cc.officina.gatorade.repository.MatchRepository;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
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
    private final AttemptRepository attemptRepository;
    private final GameService gameService;
    
    @Value("${elaboration.safetyMarginInSeconds}")
    private Long safetyMarginInSeconds;
    
    @Value("${elaboration.maxRetry}")
    private Long maxRetry;
    
    public enum TypeOfStillPending  {NO_ATTEMPT, RESTORE_FAIL, NOT_ELABORATED, TO_PO_FAIL};

    public MatchServiceImpl(MatchRepository matchRepository, AttemptRepository attemptRepository, GameService gameService) {
        this.matchRepository = matchRepository;
        this.attemptRepository = attemptRepository;
        this.gameService = gameService;
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

	@Override
	public List<Match> findByUserAndId(String userId, Long sessionId) {
		return matchRepository.findByUserAndSessionId(userId, sessionId);
	}

    @Override
	public Match resetMatch(Match match) {
		match.setValid(false);
		for(Attempt a : match.getAttempts())
		{
			a.setValid(false);
		}
		attemptRepository.save(match.getAttempts());
		matchRepository.save(match);
		return match;
	}

	@Override
	public List<Match> getMatchesByUserId(String userId)
	{
		return matchRepository.findValidByUserId(userId);
	}

	@Override
	public void deletePlayerActivities(String userId)
	{
		//si presuppone che il player andrà cancellato su playoff quindi non eseguo le chiamate per resettare i punteggi
		matchRepository.invalidateByUserId(userId);
		attemptRepository.invalidateByUserId(userId);
		
	}
	
	//@Scheduled(fixedRate = 1000)
    public void matchesRestore() {
        log.debug("START - Batch for match restore");
        List<Match> problems = matchRepository.fetchPendingMatches(maxRetry);
        Map<Long,TypeOfStillPending> stillPending = new HashMap<>();
        log.debug("Size of pending matches: " + problems.size());
        for(Match m : problems)
        {	//se il match ritornato dalla query non ha attempt è anomalo ma non risolvibile, lo indico tra quelli ancora irrisolti ma non ho modo di risolverlo
        	if(m.getAttempts().size() == 0)
        	{
        		stillPending.put(m.getId(), TypeOfStillPending.NO_ATTEMPT);
        		m.setAnomalous(true);
        		matchRepository.save(m);
        		continue;
        	}
        	//devo verificare se il match può essere potenzialmente ancora in corso
        	Long durationInSeconds = m.getTemplate().getMaxDuration() + safetyMarginInSeconds;
        	//se è scaduta la potenziale durata del match devo tentare di recuperarlo
        	if(m.getFirstStartAttempt().plusSeconds(durationInSeconds).isBefore(ZonedDateTime.now()))
        	{
        		if(m.getElaborated() == false && m.getSendToPo() == false)
        		{
        			stillPending.put(m.getId(), TypeOfStillPending.NOT_ELABORATED);
        			m.setAnomalous(true);
        			matchRepository.save(m);
        			continue;
        		}
        		
        		if(m.getElaborated() == true && m.getSendToPo() == false)
        		{
        			m.setElaborated(false);
        			gameService.endMatch(m.getGame(), m, null, null, null);
        			if(!m.getSendToPo())
        			{
        				stillPending.put(m.getId(), TypeOfStillPending.TO_PO_FAIL);
        			}
        			continue;
        		}
        	}
        }
        if(stillPending.size() > 0)
        {
        	log.debug("INVIARE MAIL DI ALERT");
        }
        log.debug("END - Batch for match restore");
    }

}
