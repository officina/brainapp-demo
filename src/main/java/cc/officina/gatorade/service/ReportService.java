package cc.officina.gatorade.service;

import cc.officina.gatorade.domain.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing Report.
 */
public interface ReportService {

    /**
     * Save a report.
     *
     * @param report the entity to save
     * @return the persisted entity
     */
    Report save(Report report);

    /**
     *  Get all the reports.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Report> findAll(Pageable pageable);

    /**
     *  Get the "id" report.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    Report findOne(Long id);

    /**
     *  Delete the "id" report.
     *
     *  @param id the id of the entity
     */
    void delete(Long id);
}
