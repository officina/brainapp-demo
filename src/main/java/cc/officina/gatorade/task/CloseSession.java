package cc.officina.gatorade.task;

import cc.officina.gatorade.service.GamificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;

@Component
public class CloseSession
{
    private GamificationService gamificationService;
    public CloseSession(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    private static final Logger log = LoggerFactory.getLogger(CloseSession.class);
    //eseguito ogni 30 minuti
	@Scheduled(fixedRate = 1800000)
    public void reportCurrentTime() {
        ZonedDateTime now = ZonedDateTime.now();
        log.info("START EXECUTION of batch for game at time " + now);
        gamificationService.elaboratePending(now);
        log.info("END EXECUTION of batch");
    }
}
