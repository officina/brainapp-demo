package cc.officina.gatorade.task;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class MatchRestore
{
	private static final Logger log = LoggerFactory.getLogger(MatchRestore.class);
	
	@Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {
        log.info("The time is now ");
    }
}
