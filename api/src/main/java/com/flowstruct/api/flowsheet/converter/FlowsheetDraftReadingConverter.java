package com.flowstruct.api.flowsheet.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flowstruct.api.flowsheet.domain.FlowsheetSnapshot;
import com.flowstruct.api.flowsheet.exception.InvalidDraftException;
import lombok.RequiredArgsConstructor;
import org.postgresql.util.PGobject;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;

@ReadingConverter
@RequiredArgsConstructor
public class FlowsheetDraftReadingConverter implements Converter<PGobject, FlowsheetSnapshot> {
    private final ObjectMapper objectMapper;

    @Override
    public FlowsheetSnapshot convert(PGobject jsonObject) {
        String draftString = jsonObject.getValue();

        try {
            return objectMapper.readValue(draftString, FlowsheetSnapshot.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new InvalidDraftException("Invalid draft.");
        }
    }
}
