package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.PlaygameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PlaygameServiceImpl implements PlaygameService {

    private final Logger log = LoggerFactory.getLogger(PlaygameServiceImpl.class);



}
