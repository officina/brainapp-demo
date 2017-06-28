package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.GamificationService;
import cc.officina.gatorade.repository.AttemptRepository;
import cc.officina.gatorade.repository.GameRepository;
import cc.officina.gatorade.repository.MatchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing Game.
 */
@Service
@Transactional
public class GamificationServiceImpl implements GamificationService{

    private final Logger log = LoggerFactory.getLogger(GamificationServiceImpl.class);

    private final GameRepository gameRepository;
    private final MatchRepository matchRepository;
    private final AttemptRepository attemptRepository;

    public GamificationServiceImpl(GameRepository gameRepository, MatchRepository matchRepository, AttemptRepository attemptRepository) {
        this.gameRepository = gameRepository;
        this.matchRepository = matchRepository;
        this.attemptRepository = attemptRepository;
    }

	@Override
	@Async
	public void runAtion(String actionId) {
		// TODO Auto-generated method stub
		System.out.println("Ciao plyoff!!");
	}


}
