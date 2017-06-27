package cc.officina.gatorade.web.rest;

import com.codahale.metrics.annotation.Timed;
import cc.officina.gatorade.domain.MatchTemplate;
import cc.officina.gatorade.service.MatchTemplateService;
import cc.officina.gatorade.web.rest.util.HeaderUtil;
import cc.officina.gatorade.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing MatchTemplate.
 */
@RestController
@RequestMapping("/api")
public class MatchTemplateResource {

    private final Logger log = LoggerFactory.getLogger(MatchTemplateResource.class);

    private static final String ENTITY_NAME = "matchTemplate";

    private final MatchTemplateService matchTemplateService;

    public MatchTemplateResource(MatchTemplateService matchTemplateService) {
        this.matchTemplateService = matchTemplateService;
    }

    /**
     * POST  /match-templates : Create a new matchTemplate.
     *
     * @param matchTemplate the matchTemplate to create
     * @return the ResponseEntity with status 201 (Created) and with body the new matchTemplate, or with status 400 (Bad Request) if the matchTemplate has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/match-templates")
    @Timed
    public ResponseEntity<MatchTemplate> createMatchTemplate(@RequestBody MatchTemplate matchTemplate) throws URISyntaxException {
        log.debug("REST request to save MatchTemplate : {}", matchTemplate);
        if (matchTemplate.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new matchTemplate cannot already have an ID")).body(null);
        }
        MatchTemplate result = matchTemplateService.save(matchTemplate);
        return ResponseEntity.created(new URI("/api/match-templates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /match-templates : Updates an existing matchTemplate.
     *
     * @param matchTemplate the matchTemplate to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated matchTemplate,
     * or with status 400 (Bad Request) if the matchTemplate is not valid,
     * or with status 500 (Internal Server Error) if the matchTemplate couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/match-templates")
    @Timed
    public ResponseEntity<MatchTemplate> updateMatchTemplate(@RequestBody MatchTemplate matchTemplate) throws URISyntaxException {
        log.debug("REST request to update MatchTemplate : {}", matchTemplate);
        if (matchTemplate.getId() == null) {
            return createMatchTemplate(matchTemplate);
        }
        MatchTemplate result = matchTemplateService.save(matchTemplate);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, matchTemplate.getId().toString()))
            .body(result);
    }

    /**
     * GET  /match-templates : get all the matchTemplates.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of matchTemplates in body
     */
    @GetMapping("/match-templates")
    @Timed
    public ResponseEntity<List<MatchTemplate>> getAllMatchTemplates(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of MatchTemplates");
        Page<MatchTemplate> page = matchTemplateService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/match-templates");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /match-templates/:id : get the "id" matchTemplate.
     *
     * @param id the id of the matchTemplate to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the matchTemplate, or with status 404 (Not Found)
     */
    @GetMapping("/match-templates/{id}")
    @Timed
    public ResponseEntity<MatchTemplate> getMatchTemplate(@PathVariable Long id) {
        log.debug("REST request to get MatchTemplate : {}", id);
        MatchTemplate matchTemplate = matchTemplateService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(matchTemplate));
    }

    /**
     * DELETE  /match-templates/:id : delete the "id" matchTemplate.
     *
     * @param id the id of the matchTemplate to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/match-templates/{id}")
    @Timed
    public ResponseEntity<Void> deleteMatchTemplate(@PathVariable Long id) {
        log.debug("REST request to delete MatchTemplate : {}", id);
        matchTemplateService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
