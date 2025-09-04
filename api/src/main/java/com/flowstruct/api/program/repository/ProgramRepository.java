package com.flowstruct.api.program.repository;

import com.flowstruct.api.program.domain.Degree;
import com.flowstruct.api.program.domain.Program;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends ListCrudRepository<Program, Long> {

    @Query("SELECT COUNT(*) > 0 FROM program WHERE LOWER(code) = LOWER(:code) AND degree = :degree")
    boolean existsByCodeAndDegree(String code, Degree degree);
}
