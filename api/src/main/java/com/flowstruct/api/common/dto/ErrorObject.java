package com.flowstruct.api.common.dto;

import java.util.Date;
import java.util.List;

public record ErrorObject(
        int statusCode,
        List<String> messages,
        Date timestamp
) {
}
