package com.flowstruct.api.flowsheet.dto;

import java.util.List;

public record TermDto(
    long id,

    int year,

    int position,

    String name,

    List<PlacementDto> placements) {
}
