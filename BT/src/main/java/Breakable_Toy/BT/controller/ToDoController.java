package Breakable_Toy.BT.controller;
import Breakable_Toy.BT.dto.CompletionStatsDto;
import Breakable_Toy.BT.dto.ToDoDto;
import Breakable_Toy.BT.mapper.ToDoMapper;
import Breakable_Toy.BT.service.ToDoService;
import Breakable_Toy.BT.todo.ToDo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/ToDos")
public class ToDoController {
    @Autowired
    ToDoService todoService;
    //Build Add ToDo REST API
    @PostMapping
    public ResponseEntity<?> createToDo(@RequestBody ToDoDto toDoDto) {
        Map<String, String> errors = validateToDoDto(toDoDto);
        if (!errors.isEmpty()) {
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        ToDoDto savedToDo = todoService.createToDo(toDoDto);
        return new ResponseEntity<>(savedToDo, HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> updateToDo(@PathVariable("id") Long todoId,
                                        @RequestBody ToDoDto updatedToDo) {
        Map<String, String> errors = validateToDoDto(updatedToDo);
        if (!errors.isEmpty()) {
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        ToDoDto toDoDto = todoService.updateToDo(todoId, updatedToDo);
        return ResponseEntity.ok(toDoDto);
    }

    //Build Get To Do REST API
    @GetMapping("{id}")
    public ResponseEntity<ToDoDto> getToDoById(@PathVariable("id") Long toDoId){
        ToDoDto toDoDto= todoService.getToDoById(toDoId);
        return ResponseEntity.ok(toDoDto);
    }
    //Build Get All To Dos REST API
    @GetMapping("/all")
    public ResponseEntity<List<ToDoDto>> getAllToDos(){
        List<ToDoDto> todos= todoService.getAllToDos();
        return ResponseEntity.ok(todos);
    }

    //Build delete todo REST API
    @DeleteMapping({"{id}"})
    public ResponseEntity<String>deleteToDo(@PathVariable("id") Long toDoId){
        todoService.deleteToDo(toDoId);
        return ResponseEntity.ok("Deleted Successfully");

    }

    @GetMapping("/completion-stats")
    public ResponseEntity<List<CompletionStatsDto>>getStats(){
        return ResponseEntity.ok(todoService.getCompletitionStats());
    }@GetMapping("/paginated")
    public ResponseEntity<Map<String, Object>> getPaginatedToDos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<ToDo> all = todoService.getAllToDosRaw(); // no mapping yet
        int totalItems = all.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);

        int fromIndex = Math.min(page * size, totalItems);
        int toIndex = Math.min(fromIndex + size, totalItems);
        List<ToDoDto> pageContent = all.subList(fromIndex, toIndex)
                .stream().map(ToDoMapper::mapToToDoDto).toList();

        Map<String, Object> response = new HashMap<>();
        response.put("todos", pageContent);
        response.put("totalPages", totalPages);
        response.put("currentPage", page);
        return ResponseEntity.ok(response);
    }
    private Map<String, String> validateToDoDto(ToDoDto dto) {
        Map<String, String> errors = new HashMap<>();

        // Text validation
        if (dto.getText() == null || dto.getText().trim().isEmpty()) {
            errors.put("text", "Task text is required.");
        } else if (dto.getText().length() > 100) {
            errors.put("text", "Task text must be less than 100 characters.");
        } else if (!dto.getText().matches("^[\\p{L}\\p{N}\\s.,!?()'\"-]{1,100}$")) {
            errors.put("text", "Task text contains invalid characters.");
        }

        // Due date validation
        if (dto.getDueDate() != null) {
            if (dto.getDueDate().isBefore(LocalDate.now().atStartOfDay())) {
                errors.put("dueDate", "Due date must be today or in the future.");
            }
        }

        // Priority validation
        if (dto.getPriority() == null ||
                (!dto.getPriority().equalsIgnoreCase("low") &&
                        !dto.getPriority().equalsIgnoreCase("medium") &&
                        !dto.getPriority().equalsIgnoreCase("high"))) {
            errors.put("priority", "Priority must be 'low', 'medium', or 'high'.");
        }

        // doneDate shouldn't exist if not completed
        if (!Boolean.TRUE.equals(dto.getCompleted()) && dto.getDoneDate() != null) {
            errors.put("doneDate", "Cannot set doneDate if task is not marked completed.");
        }

        // doneDate shouldn't be before creationDate
        if (dto.getDoneDate() != null && dto.getCreationDate() != null &&
                dto.getDoneDate().isBefore(dto.getCreationDate())) {
            errors.put("doneDate", "Done date cannot be before creation date.");
        }

        return errors;
    }


}
