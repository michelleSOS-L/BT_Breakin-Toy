package Breakable_Toy.BT.service.impl;

import Breakable_Toy.BT.dto.CompletionStatsDto;
import Breakable_Toy.BT.todo.ToDo;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

public class CompletionStatsCalculator {

    public static List<CompletionStatsDto> compute(List<ToDo> allTasks) {
        List<ToDo> doneTasks = allTasks.stream()
                .filter(ToDo::isCompleted)
                .filter(CompletionStatsCalculator::hasValidDates)
                .toList();

        Map<String, List<ToDo>> grouped = doneTasks.stream()
                .collect(Collectors.groupingBy(CompletionStatsCalculator::normalizePriority));

        List<CompletionStatsDto> result = new ArrayList<>();

        for (Map.Entry<String, List<ToDo>> entry : grouped.entrySet()) {
            double avg = calculateAverageCompletionTime(entry.getValue());
            result.add(new CompletionStatsDto(entry.getKey(), avg));
        }

        double totalAvg = calculateAverageCompletionTime(doneTasks);
        result.add(new CompletionStatsDto("ALL", totalAvg));

        return result;
    }

    private static boolean hasValidDates(ToDo task) {
        return task.getCreationDate() != null && task.getDoneDate() != null;
    }

    private static String normalizePriority(ToDo task) {
        if (task.getPriority() == null || task.getPriority().isBlank()) {
            return "UNSPECIFIED";
        }
        return task.getPriority().trim().toUpperCase();
    }

    private static double calculateAverageCompletionTime(List<ToDo> tasks) {
        return tasks.stream()
                .mapToDouble(t -> Duration.between(t.getCreationDate(), t.getDoneDate()).toMinutes())
                .average()
                .orElse(0.0);
    }
}
