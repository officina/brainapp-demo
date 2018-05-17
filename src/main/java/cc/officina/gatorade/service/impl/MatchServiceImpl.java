package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GameService;
import cc.officina.gatorade.service.MatchService;
import cc.officina.gatorade.service.ReportService;
import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.domain.Match;
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
    private final ReportService reportService;

    @Value("${elaboration.safetyMarginInSeconds}")
    private Long safetyMarginInSeconds;

    @Value("${elaboration.maxRetry}")
    private Long maxRetry;

    public enum TypeOfStillPending  {NO_ATTEMPT, RESTORE_FAIL, NOT_ELABORATED, TO_PO_FAIL, SENT_TO_PO_NOT_ELABORATED};

    public MatchServiceImpl(MatchRepository matchRepository, AttemptRepository attemptRepository, GameService gameService, ReportService reportService) {
        this.matchRepository = matchRepository;
        this.attemptRepository = attemptRepository;
        this.gameService = gameService;
        this.reportService = reportService;
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
        log.info("START - Batch for match restore");
        List<Match> problems = matchRepository.fetchPendingMatches(maxRetry);
        // la mappa stillPending mi serve per salvare il report a fine batch, l rpeort viene salvato solo nel caso in cui ci siano matches che non sono riuscito a risolvere
        Map<Long,TypeOfStillPending> stillPending = new HashMap<>();
        log.info("Size of pending matches: " + problems.size());
        for(Match m : problems)
        {
        	TypeOfStillPending result = singleMatchRestore(m);
        	if(result != null)
        	{
        		stillPending.put(m.getId(), result);
        	}
        }

        //solo se sono rimasti pending dei matches salvo un report
        if(stillPending.size() > 0)
        {
        	log.debug("SAVE REPORT");
        	reportService.saveEndBatch(stillPending);
        }
        log.debug("END - Batch for match restore");
    }

    @Override
    public TypeOfStillPending singleMatchRestore(Match m)
    {
    	//se il match ritornato dalla query non ha attempt è anomalo ma non risolvibile, lo indico tra quelli ancora irrisolti ma non ho modo di risolverlo
    	if(m.getAttempts().size() == 0)
    	{
    		log.info("MATCH RESTORE (match_ID = " + m.getId() + "): no attempts!!");
    		m.setAnomalous(true);
    		matchRepository.save(m);
    		return TypeOfStillPending.NO_ATTEMPT;
    	}
    	//devo verificare se il match può essere potenzialmente ancora in corso
    	Long durationInSeconds = m.getTemplate().getMaxDuration() + safetyMarginInSeconds;
    	//se è scaduta la potenziale durata del match devo tentare di recuperarlo
    	if(m.getFirstStartAttempt().plusSeconds(durationInSeconds).isBefore(ZonedDateTime.now()))
    	{
    		//caso in cui il match non è stato elaborato e nemmeno inviato a po, ad esempio client offline non recuperato o problemi lato client
    		if(m.getElaborated() == false && m.getSendToPo() == false)
    		{
    			log.info("MATCH RESTORE (match_ID = " + m.getId() + "): found match with elaborated = false and toPo = false");
    			//per ora lo indico come pending in attesa di eventuale logica per risolverlo
    			//lo marco come anomalo in modo da evidenziarlo lato console admin e non elaborarlo nuovamente alla prossima esecuzione del batch
    			m.setAnomalous(true);
    			matchRepository.save(m);
    			return TypeOfStillPending.NOT_ELABORATED;
    		}

    		//caso di match elaborato ma non inviato a po, ad esempio pe run player not found
    		if(m.getElaborated() == true && m.getSendToPo() == false)
    		{
    			log.info("MATCH RESTORE (match_ID = " + m.getId() + "): found match with elaborated = true and toPo = false");
    			TypeOfStillPending result = null;
    			//mi serve marcarlo come non elborato per eseguire l'endMatch
    			m.setElaborated(false);
    			//eseguo l'end match
    			gameService.endMatch(m.getGame(), m, null, null, null);
    			//entro nell'if nel caso in cui sia fallito nuovamente l'invio a playoff
    			if(!m.getSendToPo())
    			{
    				//incremento il retry
    				m.setRetry(m.getRetry() + 1);
                    if (m.getRetry() >= maxRetry){
                        m.setAnomalous(true);
                    }
    				//registro nella mappagdegli stillPending
    				result = TypeOfStillPending.TO_PO_FAIL;
    			}
    			//salvo il match
    			matchRepository.save(m);
    			return result;
    		}

    		//caso considerato per completare i casi di and, ma non si dovrebbe poter presentare
    		if(m.getElaborated() == false && m.getSendToPo() == true)
    		{
    			log.info("MATCH RESTORE (match_ID = " + m.getId() + "): found match with elaborated = false and toPo = true");
    			//l'unica cosa che posso fare è marcarlo come ancora pending
    			//lo marco come anomalo in modo da evidenziarlo lato console admin e non elaborarlo nuovamente alla prossima esecuzione del batch
    			m.setAnomalous(true);
    			matchRepository.save(m);
    			return TypeOfStillPending.SENT_TO_PO_NOT_ELABORATED;
    		}
    	}
    	return null;
    }

    @Override
    public List<Match> findValidBySessionId(Long sessionId) {
        return matchRepository.findValidBySessionId(sessionId);
    }

    @Override
    public Match findMainMatch(Long gameId, String userId) {
        return matchRepository.findMainMatch(gameId, userId);
    }

}
