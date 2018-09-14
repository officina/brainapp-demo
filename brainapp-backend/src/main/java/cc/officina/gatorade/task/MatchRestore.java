package cc.officina.gatorade.task;

import cc.officina.gatorade.service.MatchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import cc.officina.gatorade.repository.MatchRepository;

@Component
public class MatchRestore
{
    private MatchService matchService;
    public MatchRestore(MatchService matchService) {
        this.matchService = matchService;
    }

    private static final Logger log = LoggerFactory.getLogger(MatchRestore.class);
	@Scheduled(fixedRate = 300000)
    public void reportCurrentTime() {
        log.info("MatchRestore - request to start matchesRestore()");
        matchService.matchesRestore();
    }
}
