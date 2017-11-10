package cc.officina.brainapp.service.impl;

import cc.officina.brainapp.service.MatchTemplateService;
import cc.officina.brainapp.domain.MatchTemplate;
import cc.officina.brainapp.repository.MatchTemplateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing MatchTemplate.
 */
@Service
@Transactional
public class MatchTemplateServiceImpl implements MatchTemplateService{

    private final Logger log = LoggerFactory.getLogger(MatchTemplateServiceImpl.class);

    private final MatchTemplateRepository matchTemplateRepository;

    public MatchTemplateServiceImpl(MatchTemplateRepository matchTemplateRepository) {
        this.matchTemplateRepository = matchTemplateRepository;
    }

    /**
     * Save a matchTemplate.
     *
     * @param matchTemplate the entity to save
     * @return the persisted entity
     */
    @Override
    public MatchTemplate save(MatchTemplate matchTemplate) {
        log.debug("Request to save MatchTemplate : {}", matchTemplate);
        return matchTemplateRepository.save(matchTemplate);
    }

    /**
     *  Get all the matchTemplates.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<MatchTemplate> findAll(Pageable pageable) {
        log.debug("Request to get all MatchTemplates");
        return matchTemplateRepository.findAll(pageable);
    }

    /**
     *  Get one matchTemplate by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public MatchTemplate findOne(Long id) {
        log.debug("Request to get MatchTemplate : {}", id);
        return matchTemplateRepository.findOne(id);
    }

    /**
     *  Delete the  matchTemplate by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete MatchTemplate : {}", id);
        matchTemplateRepository.delete(id);
    }
}
