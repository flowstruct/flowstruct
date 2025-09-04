package com.flowstruct.api.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.flowstruct.api.common.AggregateReferenceDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jdbc.core.mapping.AggregateReference;

@Configuration
public class JacksonConfig {

    @Bean
    public Module aggregateReferenceModule() {
        SimpleModule module = new SimpleModule();
        module.addDeserializer(AggregateReference.class, new AggregateReferenceDeserializer());
        return module;
    }
}

