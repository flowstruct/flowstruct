package com.flowstruct.api.flowsheet.repository;

import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.projection.FlowsheetSummaryProjection;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlowsheetRepository extends CrudRepository<Flowsheet, Long> {
    String flowsheetSummariesQuery =
            "SELECT id, year, duration, track, (approved_flowsheet ->> 'version')::BIGINT AS approved_version, version, program, created_at, updated_at, updated_by, archived_at, archived_by " +
                    "FROM flowsheet";

    @Query(flowsheetSummariesQuery)
    List<FlowsheetSummaryProjection> findAllFlowsheetSummaries();
}
