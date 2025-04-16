package Breakable_Toy.BT.mapper;
import Breakable_Toy.BT.dto.ToDoDto;
import Breakable_Toy.BT.todo.ToDo;

/*
 private Long id;

    private String text;
    private LocalDateTime creationDate;
    private LocalDateTime doneDate;
    private boolean completed;
    private String priority;
 */
public class ToDoMapper {
    public static ToDoDto mapToToDoDto(ToDo todo){
        return new ToDoDto(
                todo.getId(),
                todo.getText(),
                todo.getCreationDate(),
                todo.getDueDate(),
                todo.getDoneDate(),
                todo.isCompleted(),
                todo.getPriority()
        );
    }
    public static ToDo mapToToDo(ToDoDto dto){
        return new ToDo(
                dto.getId(),
                dto.getText(),
                dto.getCreationDate(),
                dto.getDueDate(),
                dto.getDoneDate(),
                dto.isCompleted(),
                dto.getPriority()
        );
    }
}
