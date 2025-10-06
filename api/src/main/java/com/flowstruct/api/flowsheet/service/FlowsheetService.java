package com.flowstruct.api.flowsheet.service;

import com.flowstruct.api.flowsheet.domain.Flowsheet;
import com.flowstruct.api.flowsheet.dto.FlowsheetDto;
import com.flowstruct.api.flowsheet.dto.FlowsheetSummaryDto;
import com.flowstruct.api.flowsheet.exception.FlowsheetNotFoundException;
import com.flowstruct.api.flowsheet.mapper.FlowsheetDtoMapper;
import com.flowstruct.api.flowsheet.mapper.FlowsheetSummaryDtoMapper;
import com.flowstruct.api.flowsheet.repository.FlowsheetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class FlowsheetService {
    private final FlowsheetRepository flowsheetRepository;
    private final FlowsheetDtoMapper flowsheetDtoMapper;
    private final FlowsheetSummaryDtoMapper flowsheetSummaryDtoMapper;

    public FlowsheetDto getFlowsheet(long flowsheetId) {
        var flowsheet = findOrThrow(flowsheetId);
        return flowsheetDtoMapper.apply(flowsheet);
    }

    public Optional<FlowsheetDto> getFlowsheetIfApproved(long flowsheetId) {
        var flowsheet = findOrThrow(flowsheetId);

        if (flowsheet.getApprovedFlowsheet() == null || flowsheet.getArchivedAt() != null) {
            return Optional.empty();
        }

        var approvedFlowsheet = new Flowsheet(
                flowsheet.getId(),
                flowsheet.getApprovedFlowsheet().getYear(),
                flowsheet.getApprovedFlowsheet().getName(),
                flowsheet.getApprovedFlowsheet().getProgram(),
                flowsheet.getApprovedFlowsheet(),
                null,
                null,
                flowsheet.getApprovedFlowsheet().getVersion(),
                flowsheet.getCreatedAt(),
                flowsheet.getUpdatedAt(),
                flowsheet.getUpdatedBy(),
                flowsheet.getApprovedFlowsheet().getSections(),
                flowsheet.getApprovedFlowsheet().getPlacements(),
                flowsheet.getApprovedFlowsheet().getCoursePrerequisites(),
                flowsheet.getApprovedFlowsheet().getCourseCorequisites()
        );

        return Optional.of(flowsheetDtoMapper.apply(approvedFlowsheet));
    }

    public List<FlowsheetSummaryDto> getAllFlowsheets() {
        return flowsheetRepository.findAllFlowsheetSummaries()
                .stream()
                .map(flowsheetSummaryDtoMapper)
                .toList();
    }

    public Flowsheet findOrThrow(long flowsheetId) {
        return flowsheetRepository.findById(flowsheetId)
                .orElseThrow(() -> new FlowsheetNotFoundException("Flowsheet was not found."));
    }

    // TODO: catch OptimisticLockingFailureException in global exception handler
    public FlowsheetDto saveAndMap(Flowsheet flowsheet) {
        try {
            Flowsheet savedFlowsheet = flowsheetRepository.save(flowsheet);
            return flowsheetDtoMapper.apply(savedFlowsheet);
        } catch (OptimisticLockingFailureException e) {
            throw new OptimisticLockingFailureException(
                    "This resource has been modified by another user while you were editing. Please refresh to see the latest version."
            );
        }
    }
}
