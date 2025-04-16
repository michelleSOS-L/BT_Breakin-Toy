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
        List<ToDo> todos = toDoRepository.findAll();
        return todos.stream()
                .map(ToDoMapper::mapToToDoDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteToDo(Long id) {
        if (!toDoRepository.existsById(id)) {
            throw new ResourceNotFoundException("The To Do does not exist");
        }
        toDoRepository.deleteById(id);
    }

    @Override
    public List<CompletionStatsDto> getCompletitionStats() {
        List<ToDo> doneTasks = toDoRepository.findAll().stream()
                .filter(ToDo::isCompleted)
                .filter(t -> t.getCreationDate() != null && t.getDoneDate() != null)
                .collect(Collectors.toList());

        Map<String, List<ToDo>> grouped = doneTasks.stream()
                .collect(Collectors.groupingBy(t -> t.getPriority().toUpperCase()));

        List<CompletionStatsDto> result = new ArrayList<>();

        for (Map.Entry<String, List<ToDo>> entry : grouped.entrySet()) {
            double avg = entry.getValue().stream()
                    .mapToDouble(t -> Duration.between(t.getCreationDate(), t.getDoneDate()).toMinutes())
                    .average().orElse(0);
            result.add(new CompletionStatsDto(entry.getKey(), avg));
        }

        // Overall average
        double totalAvg = doneTasks.stream()
                .mapToDouble(t -> Duration.between(t.getCreationDate(), t.getDoneDate()).toMinutes())
                .average().orElse(0);

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

        existing.setText(updatedDto.getText());
        existing.setCompleted(updatedDto.isCompleted());
        existing.setDueDate(updatedDto.getDueDate());
        existing.setCreationDate(updatedDto.getCreationDate());
        existing.setDoneDate(updatedDto.getDoneDate());
        existing.setPriority(updatedDto.getPriority());

        ToDo saved = toDoRepository.save(existing);
        return ToDoMapper.mapToToDoDto(saved);
    }
}