package cc.officina.gatorade.web.rest;

import cc.officina.gatorade.GatoradeApp;

import cc.officina.gatorade.domain.Attempt;
import cc.officina.gatorade.repository.AttemptRepository;
import cc.officina.gatorade.service.AttemptService;
import cc.officina.gatorade.web.rest.errors.ExceptionTranslator;

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
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static cc.officina.gatorade.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the AttemptResource REST controller.
 *
 * @see AttemptResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = GatoradeApp.class)
public class AttemptResourceIntTest {

    private static final Long DEFAULT_ATTEMPT_SCORE = 1L;
    private static final Long UPDATED_ATTEMPT_SCORE = 2L;

    private static final ZonedDateTime DEFAULT_START_ATTEMPT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_START_ATTEMPT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_STOP_ATTEMPT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_STOP_ATTEMPT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_LEVEL_REACHED = 1L;
    private static final Long UPDATED_LEVEL_REACHED = 2L;

    private static final ZonedDateTime DEFAULT_LAST_UPDATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_UPDATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_CANCELLED = false;
    private static final Boolean UPDATED_CANCELLED = true;

    private static final Boolean DEFAULT_COMPLETED = false;
    private static final Boolean UPDATED_COMPLETED = true;

    @Autowired
    private AttemptRepository attemptRepository;

    @Autowired
    private AttemptService attemptService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAttemptMockMvc;

    private Attempt attempt;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        AttemptResource attemptResource = new AttemptResource(attemptService);
        this.restAttemptMockMvc = MockMvcBuilders.standaloneSetup(attemptResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attempt createEntity(EntityManager em) {
        Attempt attempt = new Attempt()
            .attemptScore(DEFAULT_ATTEMPT_SCORE)
            .startAttempt(DEFAULT_START_ATTEMPT)
            .stopAttempt(DEFAULT_STOP_ATTEMPT)
            .levelReached(DEFAULT_LEVEL_REACHED)
            .lastUpdate(DEFAULT_LAST_UPDATE)
            .cancelled(DEFAULT_CANCELLED)
            .completed(DEFAULT_COMPLETED);
        return attempt;
    }

    @Before
    public void initTest() {
        attempt = createEntity(em);
    }

    @Test
    @Transactional
    public void createAttempt() throws Exception {
        int databaseSizeBeforeCreate = attemptRepository.findAll().size();

        // Create the Attempt
        restAttemptMockMvc.perform(post("/api/attempts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attempt)))
            .andExpect(status().isCreated());

        // Validate the Attempt in the database
        List<Attempt> attemptList = attemptRepository.findAll();
        assertThat(attemptList).hasSize(databaseSizeBeforeCreate + 1);
        Attempt testAttempt = attemptList.get(attemptList.size() - 1);
        assertThat(testAttempt.getAttemptScore()).isEqualTo(DEFAULT_ATTEMPT_SCORE);
        assertThat(testAttempt.getStartAttempt()).isEqualTo(DEFAULT_START_ATTEMPT);
        assertThat(testAttempt.getStopAttempt()).isEqualTo(DEFAULT_STOP_ATTEMPT);
        assertThat(testAttempt.getLevelReached()).isEqualTo(DEFAULT_LEVEL_REACHED);
        assertThat(testAttempt.getLastUpdate()).isEqualTo(DEFAULT_LAST_UPDATE);
        assertThat(testAttempt.isCancelled()).isEqualTo(DEFAULT_CANCELLED);
        assertThat(testAttempt.isCompleted()).isEqualTo(DEFAULT_COMPLETED);
    }

    @Test
    @Transactional
    public void createAttemptWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = attemptRepository.findAll().size();

        // Create the Attempt with an existing ID
        attempt.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttemptMockMvc.perform(post("/api/attempts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attempt)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Attempt> attemptList = attemptRepository.findAll();
        assertThat(attemptList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllAttempts() throws Exception {
        // Initialize the database
        attemptRepository.saveAndFlush(attempt);

        // Get all the attemptList
        restAttemptMockMvc.perform(get("/api/attempts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attempt.getId().intValue())))
            .andExpect(jsonPath("$.[*].attemptScore").value(hasItem(DEFAULT_ATTEMPT_SCORE.intValue())))
            .andExpect(jsonPath("$.[*].startAttempt").value(hasItem(sameInstant(DEFAULT_START_ATTEMPT))))
            .andExpect(jsonPath("$.[*].stopAttempt").value(hasItem(sameInstant(DEFAULT_STOP_ATTEMPT))))
            .andExpect(jsonPath("$.[*].levelReached").value(hasItem(DEFAULT_LEVEL_REACHED.intValue())))
            .andExpect(jsonPath("$.[*].lastUpdate").value(hasItem(sameInstant(DEFAULT_LAST_UPDATE))))
            .andExpect(jsonPath("$.[*].cancelled").value(hasItem(DEFAULT_CANCELLED.booleanValue())))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())));
    }

    @Test
    @Transactional
    public void getAttempt() throws Exception {
        // Initialize the database
        attemptRepository.saveAndFlush(attempt);

        // Get the attempt
        restAttemptMockMvc.perform(get("/api/attempts/{id}", attempt.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(attempt.getId().intValue()))
            .andExpect(jsonPath("$.attemptScore").value(DEFAULT_ATTEMPT_SCORE.intValue()))
            .andExpect(jsonPath("$.startAttempt").value(sameInstant(DEFAULT_START_ATTEMPT)))
            .andExpect(jsonPath("$.stopAttempt").value(sameInstant(DEFAULT_STOP_ATTEMPT)))
            .andExpect(jsonPath("$.levelReached").value(DEFAULT_LEVEL_REACHED.intValue()))
            .andExpect(jsonPath("$.lastUpdate").value(sameInstant(DEFAULT_LAST_UPDATE)))
            .andExpect(jsonPath("$.cancelled").value(DEFAULT_CANCELLED.booleanValue()))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAttempt() throws Exception {
        // Get the attempt
        restAttemptMockMvc.perform(get("/api/attempts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAttempt() throws Exception {
        // Initialize the database
        attemptService.save(attempt);

        int databaseSizeBeforeUpdate = attemptRepository.findAll().size();

        // Update the attempt
        Attempt updatedAttempt = attemptRepository.findOne(attempt.getId());
        updatedAttempt
            .attemptScore(UPDATED_ATTEMPT_SCORE)
            .startAttempt(UPDATED_START_ATTEMPT)
            .stopAttempt(UPDATED_STOP_ATTEMPT)
            .levelReached(UPDATED_LEVEL_REACHED)
            .lastUpdate(UPDATED_LAST_UPDATE)
            .cancelled(UPDATED_CANCELLED)
            .completed(UPDATED_COMPLETED);

        restAttemptMockMvc.perform(put("/api/attempts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAttempt)))
            .andExpect(status().isOk());

        // Validate the Attempt in the database
        List<Attempt> attemptList = attemptRepository.findAll();
        assertThat(attemptList).hasSize(databaseSizeBeforeUpdate);
        Attempt testAttempt = attemptList.get(attemptList.size() - 1);
        assertThat(testAttempt.getAttemptScore()).isEqualTo(UPDATED_ATTEMPT_SCORE);
        assertThat(testAttempt.getStartAttempt()).isEqualTo(UPDATED_START_ATTEMPT);
        assertThat(testAttempt.getStopAttempt()).isEqualTo(UPDATED_STOP_ATTEMPT);
        assertThat(testAttempt.getLevelReached()).isEqualTo(UPDATED_LEVEL_REACHED);
        assertThat(testAttempt.getLastUpdate()).isEqualTo(UPDATED_LAST_UPDATE);
        assertThat(testAttempt.isCancelled()).isEqualTo(UPDATED_CANCELLED);
        assertThat(testAttempt.isCompleted()).isEqualTo(UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    public void updateNonExistingAttempt() throws Exception {
        int databaseSizeBeforeUpdate = attemptRepository.findAll().size();

        // Create the Attempt

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAttemptMockMvc.perform(put("/api/attempts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(attempt)))
            .andExpect(status().isCreated());

        // Validate the Attempt in the database
        List<Attempt> attemptList = attemptRepository.findAll();
        assertThat(attemptList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAttempt() throws Exception {
        // Initialize the database
        attemptService.save(attempt);

        int databaseSizeBeforeDelete = attemptRepository.findAll().size();

        // Get the attempt
        restAttemptMockMvc.perform(delete("/api/attempts/{id}", attempt.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Attempt> attemptList = attemptRepository.findAll();
        assertThat(attemptList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Attempt.class);
        Attempt attempt1 = new Attempt();
        attempt1.setId(1L);
        Attempt attempt2 = new Attempt();
        attempt2.setId(attempt1.getId());
        assertThat(attempt1).isEqualTo(attempt2);
        attempt2.setId(2L);
        assertThat(attempt1).isNotEqualTo(attempt2);
        attempt1.setId(null);
        assertThat(attempt1).isNotEqualTo(attempt2);
    }
}
