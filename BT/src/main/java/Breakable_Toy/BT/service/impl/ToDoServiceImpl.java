package Breakable_Toy.BT.service.impl;

import Breakable_Toy.BT.dto.CompletionStatsDto;
import Breakable_Toy.BT.dto.ToDoDto;
import Breakable_Toy.BT.exception.ResourceNotFoundException;
import Breakable_Toy.BT.mapper.ToDoMapper;
import Breakable_Toy.BT.repository.ToDoRepo;
import Breakable_Toy.BT.service.ToDoService;
import Breakable_Toy.BT.todo.ToDo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ToDoServiceImpl implements ToDoService {

    private final ToDoRepo toDoRepository;

    @Override
    public ToDoDto createToDo(ToDoDto todoDto) {
        ToDo todo = ToDoMapper.mapToToDo(todoDto);
        ToDo savedToDo = toDoRepository.save(todo);
        return ToDoMapper.mapToToDoDto(savedToDo);
    }

    @Override
    public ToDoDto getToDoById(Long toDoId) {
        ToDo todo = toDoRepository.findById(toDoId)
                .orElseThrow(() -> new ResourceNotFoundException("The To Do does not exist"));
        return ToDoMapper.mapToToDoDto(todo);
    }

    @Override
    public List<ToDoDto> getAllToDos() {
        return toDoRepository.findAll().stream()
                .map(ToDoMapper::mapToToDoDto)
                .toList();
    }

    @Override
    public void deleteToDo(Long id) {
        ToDo todo = toDoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The To Do does not exist"));
        toDoRepository.deleteById(todo.getId());
    }

    @Override
    public List<CompletionStatsDto> getCompletitionStats() {
        List<ToDo> doneTasks = toDoRepository.findAll().stream()
                .filter(ToDo::isCompleted)
                .filter(t -> t.getCreationDate() != null && t.getDoneDate() != null)
                .collect(Collectors.toList());

        Map<String, List<ToDo>> grouped = doneTasks.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getPriority() != null ? t.getPriority().toUpperCase() : "UNSPECIFIED"
                ));

        List<CompletionStatsDto> result = new ArrayList<>();

        for (Map.Entry<String, List<ToDo>> entry : grouped.entrySet()) {
            double avg = entry.getValue().stream()
                    .mapToDouble(t -> Duration.between(t.getCreationDate(), t.getDoneDate()).toMinutes())
                    .average()
                    .orElse(0);
            result.add(new CompletionStatsDto(entry.getKey(), avg));
        }

        double totalAvg = doneTasks.stream()
                .mapToDouble(t -> Duration.between(t.getCreationDate(), t.getDoneDate()).toMinutes())
                .average()
                .orElse(0);

        result.add(new CompletionStatsDto("ALL", totalAvg));

        return result;
    }


    @Override
    public List<ToDo> getAllToDosRaw() {
        return toDoRepository.findAll();
    }

    @Override
    public ToDoDto updateToDo(Long id, ToDoDto updatedDto) {
        ToDo existing = toDoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("The To Do does not exist"));

        // Only update non-null values
        if (updatedDto.getText() != null) existing.setText(updatedDto.getText());
        if (updatedDto.getCompleted() != null) {
            existing.setCompleted(updatedDto.getCompleted());
        }
        if (updatedDto.getDueDate() != null) existing.setDueDate(updatedDto.getDueDate());
        if (updatedDto.getCreationDate() != null) existing.setCreationDate(updatedDto.getCreationDate());
        if (updatedDto.getDoneDate() != null) existing.setDoneDate(updatedDto.getDoneDate());
        if (updatedDto.getPriority() != null) existing.setPriority(updatedDto.getPriority());

        ToDo saved = toDoRepository.save(existing);
        return ToDoMapper.mapToToDoDto(saved);
    }

    // -- Helpers --

    private boolean hasValidDates(ToDo task) {
        return task.getCreationDate() != null && task.getDoneDate() != null;
    }

    private String normalizePriority(ToDo task) {
        String priority = task.getPriority();
        return (priority == null || priority.isBlank()) ? "UNSPECIFIED" : priority.trim().toUpperCase();
    }

    private double calculateAverageCompletionTime(List<ToDo> tasks) {
        return tasks.stream()
                .mapToDouble(t -> Duration.between(t.getCreationDate(), t.getDoneDate()).toMinutes())
                .average()
                .orElse(0.0);
    }
}
