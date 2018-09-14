package cc.officina.gatorade.task;

import java.time.ZonedDateTime;
import java.util.TimerTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import cc.officina.gatorade.service.GamificationService;


public class SessionTask extends TimerTask {
	private final Logger log = LoggerFactory.getLogger(SessionTask.class);
	private GamificationService gamificationService;

	public SessionTask(GamificationService gamificationService) {
		this.gamificationService = gamificationService;
	}

	@Deprecated
	@Override
	@Transactional
	public void run() {
		ZonedDateTime now = ZonedDateTime.now();
		log.info("START EXECUTION of batch for game at time " + now);
		gamificationService.elaboratePending(now);
		log.info("END EXECUTION of batch");
	}

}
