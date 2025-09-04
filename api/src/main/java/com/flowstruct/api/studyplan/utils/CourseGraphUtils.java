package com.flowstruct.api.studyplan.utils;

import com.flowstruct.api.course.domain.CourseSequences;
import com.flowstruct.api.studyplan.domain.CoursePrerequisite;
import com.flowstruct.api.studyplan.domain.Relation;
import com.flowstruct.api.studyplan.domain.StudyPlan;
import com.flowstruct.api.studyplan.exception.CyclicDependencyException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CourseGraphUtils {
    public Map<Long, CourseSequences> buildStudyPlanSequences(
            Map<Long, Map<Long, Relation>> coursePrerequisites,
            List<Long> courseIds
    ) {
        Set<Long> visited = new HashSet<>();
        Map<Long, CourseSequences> courseSequencesMap = new HashMap<>();

        for (var courseId : courseIds) {
            courseSequencesMap.put(
                    courseId,
                    new CourseSequences(new HashSet<>(), new HashSet<>(), 1)
            );
        }

        for (var courseId : courseIds) {
            if (!visited.contains(courseId)) {
                traversePrerequisites(courseId, coursePrerequisites, visited, courseSequencesMap);
            }
        }

        visited.clear();

        for (var courseId : courseIds) {
            if (!visited.contains(courseId)) {
                traversePostrequisites(courseId, visited, courseSequencesMap);
            }
        }

        return courseSequencesMap;
    }

    public void validatePrerequisites(
            long parentCourseId,
            StudyPlan studyPlan,
            List<Long> prerequisites
    ) {
        var coursePrerequisitesMap = studyPlan.getCoursePrerequisitesMap();

        Set<Long> visited = new HashSet<>();

        for (var prerequisite : prerequisites) {
            if (!visited.contains(prerequisite)) {
                detectCycle(parentCourseId, prerequisite, visited, coursePrerequisitesMap);
            }
        }
    }

    private void detectCycle(
            long originalCourseId,
            long prerequisiteId,
            Set<Long> visited,
            Map<Long, List<CoursePrerequisite>> coursePrerequisitesMap
    ) {
        if (visited.contains(prerequisiteId)) return;

        if (originalCourseId == prerequisiteId) throw new CyclicDependencyException("Cycle detected.");

        var prerequisites = coursePrerequisitesMap.get(prerequisiteId);

        if (prerequisites == null) return;

        for (var prerequisite : prerequisites) {
            if (!visited.contains(prerequisite.getPrerequisite().getId())) {
                detectCycle(originalCourseId, prerequisite.getPrerequisite().getId(), visited, coursePrerequisitesMap);
            }
        }

        visited.add(prerequisiteId);
    }

    private void traversePrerequisites(
            long courseId,
            Map<Long, Map<Long, Relation>> coursePrerequisites,
            Set<Long> visited,
            Map<Long, CourseSequences> courseSequencesMap
    ) {
        if (coursePrerequisites.get(courseId) == null) return;

        var prerequisites = coursePrerequisites.get(courseId).entrySet();

        for (var prerequisite : prerequisites) {
            var prerequisiteId = prerequisite.getKey();

            if (!visited.contains(prerequisiteId)) {
                traversePrerequisites(prerequisiteId, coursePrerequisites, visited, courseSequencesMap);
            }

            var courseSequences = courseSequencesMap.get(courseId);
            var prerequisiteCourseSequences = courseSequencesMap.get(prerequisiteId);

            courseSequences.getPrerequisiteSequence()
                    .addAll(prerequisiteCourseSequences.getPrerequisiteSequence());

            courseSequences.getPrerequisiteSequence().add(prerequisiteId);

            prerequisiteCourseSequences.getPostrequisiteSequence().add(courseId);

            if (courseSequences.getLevel() <= prerequisiteCourseSequences.getLevel()) {
                courseSequences.setLevel(prerequisiteCourseSequences.getLevel() + 1);
            }
        }

        visited.add(courseId);
    }

    private void traversePostrequisites(
            long courseId,
            Set<Long> visited,
            Map<Long, CourseSequences> courseSequencesMap
    ) {
        var courseSequences = courseSequencesMap.get(courseId);

        var postrequisiteCourses = new HashSet<>(courseSequences.getPostrequisiteSequence());

        for (var postrequisiteId : postrequisiteCourses) {
            if (!visited.contains(postrequisiteId)) {
                traversePostrequisites(postrequisiteId, visited, courseSequencesMap);
            }

            var postrequisiteCourseSequences = courseSequencesMap.get(postrequisiteId);

            courseSequences.getPostrequisiteSequence().add(postrequisiteId);
            courseSequences.getPostrequisiteSequence()
                    .addAll(postrequisiteCourseSequences.getPostrequisiteSequence());
        }

        visited.add(courseId);
    }
}
