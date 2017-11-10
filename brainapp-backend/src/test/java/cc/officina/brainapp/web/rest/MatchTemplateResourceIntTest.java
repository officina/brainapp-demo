package cc.officina.brainapp.web.rest;

import cc.officina.brainapp.BrainappbackendApp;

import cc.officina.brainapp.domain.MatchTemplate;
import cc.officina.brainapp.repository.MatchTemplateRepository;
import cc.officina.brainapp.service.MatchTemplateService;
import cc.officina.brainapp.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static cc.officina.brainapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the MatchTemplateResource REST controller.
 *
 * @see MatchTemplateResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BrainappbackendApp.class)
public class MatchTemplateResourceIntTest {

    private static final Long DEFAULT_MAX_DURATION = 1L;
    private static final Long UPDATED_MAX_DURATION = 2L;

    private static final Long DEFAULT_MAX_ATTEMPT = 1L;
    private static final Long UPDATED_MAX_ATTEMPT = 2L;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_CUSTOM = false;
    private static final Boolean UPDATED_CUSTOM = true;

    @Autowired
    private MatchTemplateRepository matchTemplateRepository;

    @Autowired
    private MatchTemplateService matchTemplateService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restMatchTemplateMockMvc;

    private MatchTemplate matchTemplate;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MatchTemplateResource matchTemplateResource = new MatchTemplateResource(matchTemplateService);
        this.restMatchTemplateMockMvc = MockMvcBuilders.standaloneSetup(matchTemplateResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MatchTemplate createEntity(EntityManager em) {
        MatchTemplate matchTemplate = new MatchTemplate()
            .maxDuration(DEFAULT_MAX_DURATION)
            .maxAttempt(DEFAULT_MAX_ATTEMPT)
            .description(DEFAULT_DESCRIPTION)
            .custom(DEFAULT_CUSTOM);
        return matchTemplate;
    }

    @Before
    public void initTest() {
        matchTemplate = createEntity(em);
    }

    @Test
    @Transactional
    public void createMatchTemplate() throws Exception {
        int databaseSizeBeforeCreate = matchTemplateRepository.findAll().size();

        // Create the MatchTemplate
        restMatchTemplateMockMvc.perform(post("/api/match-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(matchTemplate)))
            .andExpect(status().isCreated());

        // Validate the MatchTemplate in the database
        List<MatchTemplate> matchTemplateList = matchTemplateRepository.findAll();
        assertThat(matchTemplateList).hasSize(databaseSizeBeforeCreate + 1);
        MatchTemplate testMatchTemplate = matchTemplateList.get(matchTemplateList.size() - 1);
        assertThat(testMatchTemplate.getMaxDuration()).isEqualTo(DEFAULT_MAX_DURATION);
        assertThat(testMatchTemplate.getMaxAttempt()).isEqualTo(DEFAULT_MAX_ATTEMPT);
        assertThat(testMatchTemplate.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMatchTemplate.isCustom()).isEqualTo(DEFAULT_CUSTOM);
    }

    @Test
    @Transactional
    public void createMatchTemplateWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = matchTemplateRepository.findAll().size();

        // Create the MatchTemplate with an existing ID
        matchTemplate.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMatchTemplateMockMvc.perform(post("/api/match-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(matchTemplate)))
            .andExpect(status().isBadRequest());

        // Validate the MatchTemplate in the database
        List<MatchTemplate> matchTemplateList = matchTemplateRepository.findAll();
        assertThat(matchTemplateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllMatchTemplates() throws Exception {
        // Initialize the database
        matchTemplateRepository.saveAndFlush(matchTemplate);

        // Get all the matchTemplateList
        restMatchTemplateMockMvc.perform(get("/api/match-templates?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(matchTemplate.getId().intValue())))
            .andExpect(jsonPath("$.[*].maxDuration").value(hasItem(DEFAULT_MAX_DURATION.intValue())))
            .andExpect(jsonPath("$.[*].maxAttempt").value(hasItem(DEFAULT_MAX_ATTEMPT.intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].custom").value(hasItem(DEFAULT_CUSTOM.booleanValue())));
    }

    @Test
    @Transactional
    public void getMatchTemplate() throws Exception {
        // Initialize the database
        matchTemplateRepository.saveAndFlush(matchTemplate);

        // Get the matchTemplate
        restMatchTemplateMockMvc.perform(get("/api/match-templates/{id}", matchTemplate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(matchTemplate.getId().intValue()))
            .andExpect(jsonPath("$.maxDuration").value(DEFAULT_MAX_DURATION.intValue()))
            .andExpect(jsonPath("$.maxAttempt").value(DEFAULT_MAX_ATTEMPT.intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.custom").value(DEFAULT_CUSTOM.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingMatchTemplate() throws Exception {
        // Get the matchTemplate
        restMatchTemplateMockMvc.perform(get("/api/match-templates/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMatchTemplate() throws Exception {
        // Initialize the database
        matchTemplateService.save(matchTemplate);

        int databaseSizeBeforeUpdate = matchTemplateRepository.findAll().size();

        // Update the matchTemplate
        MatchTemplate updatedMatchTemplate = matchTemplateRepository.findOne(matchTemplate.getId());
        updatedMatchTemplate
            .maxDuration(UPDATED_MAX_DURATION)
            .maxAttempt(UPDATED_MAX_ATTEMPT)
            .description(UPDATED_DESCRIPTION)
            .custom(UPDATED_CUSTOM);

        restMatchTemplateMockMvc.perform(put("/api/match-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMatchTemplate)))
            .andExpect(status().isOk());

        // Validate the MatchTemplate in the database
        List<MatchTemplate> matchTemplateList = matchTemplateRepository.findAll();
        assertThat(matchTemplateList).hasSize(databaseSizeBeforeUpdate);
        MatchTemplate testMatchTemplate = matchTemplateList.get(matchTemplateList.size() - 1);
        assertThat(testMatchTemplate.getMaxDuration()).isEqualTo(UPDATED_MAX_DURATION);
        assertThat(testMatchTemplate.getMaxAttempt()).isEqualTo(UPDATED_MAX_ATTEMPT);
        assertThat(testMatchTemplate.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMatchTemplate.isCustom()).isEqualTo(UPDATED_CUSTOM);
    }

    @Test
    @Transactional
    public void updateNonExistingMatchTemplate() throws Exception {
        int databaseSizeBeforeUpdate = matchTemplateRepository.findAll().size();

        // Create the MatchTemplate

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restMatchTemplateMockMvc.perform(put("/api/match-templates")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(matchTemplate)))
            .andExpect(status().isCreated());

        // Validate the MatchTemplate in the database
        List<MatchTemplate> matchTemplateList = matchTemplateRepository.findAll();
        assertThat(matchTemplateList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteMatchTemplate() throws Exception {
        // Initialize the database
        matchTemplateService.save(matchTemplate);

        int databaseSizeBeforeDelete = matchTemplateRepository.findAll().size();

        // Get the matchTemplate
        restMatchTemplateMockMvc.perform(delete("/api/match-templates/{id}", matchTemplate.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<MatchTemplate> matchTemplateList = matchTemplateRepository.findAll();
        assertThat(matchTemplateList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MatchTemplate.class);
        MatchTemplate matchTemplate1 = new MatchTemplate();
        matchTemplate1.setId(1L);
        MatchTemplate matchTemplate2 = new MatchTemplate();
        matchTemplate2.setId(matchTemplate1.getId());
        assertThat(matchTemplate1).isEqualTo(matchTemplate2);
        matchTemplate2.setId(2L);
        assertThat(matchTemplate1).isNotEqualTo(matchTemplate2);
        matchTemplate1.setId(null);
        assertThat(matchTemplate1).isNotEqualTo(matchTemplate2);
    }
}
