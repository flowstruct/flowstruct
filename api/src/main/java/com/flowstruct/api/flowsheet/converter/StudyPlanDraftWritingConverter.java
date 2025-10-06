package com.flowstruct.api.flowsheet.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowstruct.api.flowsheet.domain.FlowsheetSnapshot;
import com.flowstruct.api.flowsheet.exception.InvalidDraftException;
import lombok.RequiredArgsConstructor;
import org.postgresql.util.PGobject;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;

import java.sql.SQLException;

@WritingConverter
@RequiredArgsConstructor
public class StudyPlanDraftWritingConverter implements Converter<FlowsheetSnapshot, PGobject> {
    private final ObjectMapper objectMapper;

    @Override
    public PGobject convert(FlowsheetSnapshot draft) {
        PGobject jsonObject = new PGobject();
        jsonObject.setType("json");

        try {
            jsonObject.setValue(objectMapper.writeValueAsString(draft));
        } catch (SQLException | JsonProcessingException e) {
            throw new InvalidDraftException("Draft is invalid.");
        }

        return jsonObject;
    }
}
