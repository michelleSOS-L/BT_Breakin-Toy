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
    public ResponseEntity<ToDoDto> createToDo(@RequestBody ToDoDto toDoDto){
        ToDoDto savedToDo= todoService.createToDo(toDoDto);
        return new ResponseEntity<>(savedToDo, HttpStatus.CREATED);
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
    //Build updated todo REST API
    @PutMapping("{id}")
    public ResponseEntity<ToDoDto>updateToDo(@PathVariable("id")  Long todoId,
                                             @RequestBody ToDoDto updatedToDo) {
        ToDoDto toDoDto = todoService.updateToDo(todoId, updatedToDo);
        return ResponseEntity.ok(toDoDto);
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
}
