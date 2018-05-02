package cc.officina.gatorade.service.impl;

import cc.officina.gatorade.service.ReportService;
import cc.officina.gatorade.service.impl.MatchServiceImpl.TypeOfStillPending;
import org.json.JSONArray;
import cc.officina.gatorade.domain.Report;
import cc.officina.gatorade.domain.ReportRequest;
import cc.officina.gatorade.domain.enumeration.ReportType;
import cc.officina.gatorade.repository.ReportRepository;

import java.time.ZonedDateTime;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing Report.
 */
@Service
@Transactional
public class ReportServiceImpl implements ReportService{

    private final Logger log = LoggerFactory.getLogger(ReportServiceImpl.class);

    private final ReportRepository reportRepository;

    public static String BatchUser = "BATCH";

    public ReportServiceImpl(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /**
     * Save a report.
     *
     * @param report the entity to save
     * @return the persisted entity
     */
    @Override
    public Report save(Report report) {
        log.debug("Request to save Report : {}", report);
        return reportRepository.save(report);
    }

    /**
     *  Get all the reports.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Report> findAll(Pageable pageable) {
        log.debug("Request to get all Reports");
        return reportRepository.findAll(pageable);
    }

    /**
     *  Get one report by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Report findOne(Long id) {
        log.debug("Request to get Report : {}", id);
        return reportRepository.findOne(id);
    }

    /**
     *  Delete the  report by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Report : {}", id);
        reportRepository.delete(id);
    }

    @Override
	public Report matchReport(Long id, String userid, ReportRequest request) {
		Report report = new Report();
		report.setJson(request.getInfo().toString());
        report.setUserAgent(request.getUserAgent().toString());
        report.setTimestamp(ZonedDateTime.now());
        report.setType(ReportType.Endmatch);
        report.setUserid(userid);
        report.setMatch_id(id);
        reportRepository.save(report);
        return report;
	}

    @Override
	public Report matchError(Long id, String userid, ReportRequest request) {
		Report report = new Report();
        report.setJson(request.getInfo().toString());
        report.setUserAgent(request.getUserAgent().toString());
        report.setTimestamp(ZonedDateTime.now());
        report.setType(ReportType.Error);
        report.setUserid(userid);
        report.setMatch_id(id);
        reportRepository.save(report);
        return report;
	}

	@Override
	public void saveEndBatch(Map<Long, TypeOfStillPending> stillPending)
	{
		Report report = new Report();
		report.setTimestamp(ZonedDateTime.now());
		report.setType(ReportType.ResumeReport);
		report.setUserid(BatchUser);

		JSONArray json = new JSONArray();

		for (Map.Entry<Long, TypeOfStillPending> entry : stillPending.entrySet())
		{
		    System.out.println(entry.getKey() + "/" + entry.getValue());
		    JSONObject obj = new JSONObject();
		    try
			{
				obj.append("matchId", entry.getKey());
				obj.append("type", entry.getValue());
			    json.put(obj);
			}
			catch (JSONException e)
			{
				log.error(e.getMessage());
				e.printStackTrace();
			}
		}

		report.setJson(json.toString());
		reportRepository.save(report);
	}

}
