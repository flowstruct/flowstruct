package com.flowstruct.api.studyplan.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowstruct.api.studyplan.domain.StudyPlanDraft;
import com.flowstruct.api.studyplan.exception.InvalidDraftException;
import lombok.RequiredArgsConstructor;
import org.postgresql.util.PGobject;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;

@ReadingConverter
@RequiredArgsConstructor
public class StudyPlanDraftReadingConverter implements Converter<PGobject, StudyPlanDraft> {
    private final ObjectMapper objectMapper;

    @Override
    public StudyPlanDraft convert(PGobject jsonObject) {
        String draftString = jsonObject.getValue();

        try {
            return objectMapper.readValue(draftString, StudyPlanDraft.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new InvalidDraftException("Invalid draft.");
        }
    }
}
