package com.flowstruct.api.course.repository;

import com.flowstruct.api.course.domain.Course;
import com.flowstruct.api.course.projection.CourseRowWithCount;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends ListCrudRepository<Course, Long> {

    @Query(
            "SELECT *, COUNT(*) OVER() AS total_courses " +
                    "FROM course c " +
                    "WHERE (name ILIKE :filter OR code ILIKE :filter) " +
                    "AND (:status = 'all' OR " +
                    "    (:status = 'active' AND outdated_at IS NULL) OR " +
                    "    (:status = 'outdated' AND outdated_at IS NOT NULL)) " +
                    "LIMIT :limit OFFSET :offset"
    )
    List<CourseRowWithCount> findPagedCourses(int limit, long offset, String filter, String status);

    boolean existsByCodeIgnoreCase(String code);
}
