package com.flowstruct.api.common;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.jdbc.core.mapping.AggregateReference;

import java.io.IOException;

public class AggregateReferenceDeserializer extends JsonDeserializer<AggregateReference<?, ?>> {

    @Override
    public AggregateReference<?, ?> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);

        JsonNode idNode = node.get("id");
        if (idNode == null || !idNode.isNumber()) {
            throw new JsonMappingException(p, "Expected an object with numeric 'id' field");
        }

        Long id = idNode.longValue();
        return AggregateReference.to(id);
    }
}
