package com.flowstruct.api.studyplan.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowstruct.api.studyplan.domain.StudyPlanDraft;
import com.flowstruct.api.studyplan.exception.InvalidDraftException;
import lombok.RequiredArgsConstructor;
import org.postgresql.util.PGobject;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;

import java.sql.SQLException;

@WritingConverter
@RequiredArgsConstructor
public class StudyPlanDraftWritingConverter implements Converter<StudyPlanDraft, PGobject> {
    private final ObjectMapper objectMapper;

    @Override
    public PGobject convert(StudyPlanDraft draft) {
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
