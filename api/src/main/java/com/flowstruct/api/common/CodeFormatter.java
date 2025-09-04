package com.flowstruct.api.common;

import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class CodeFormatter implements Function<String, String> {

    @Override
    public String apply(String code) {
        return code
                .toUpperCase()
                .trim()
                .replaceAll("\\s+", "");
    }
}
