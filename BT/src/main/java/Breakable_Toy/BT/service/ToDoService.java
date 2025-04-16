package Breakable_Toy.BT.service;

import Breakable_Toy.BT.dto.CompletionStatsDto;
import Breakable_Toy.BT.dto.ToDoDto;
import Breakable_Toy.BT.todo.ToDo;

import java.util.List;

public interface ToDoService {
    ToDoDto createToDo(ToDoDto todoDto);
    ToDoDto getToDoById(Long toDoId);
    List<ToDoDto> getAllToDos();
    ToDoDto updateToDo(Long todoId, ToDoDto updatedToDo);
    void deleteToDo(Long toDoId);
    List<CompletionStatsDto> getCompletitionStats();
    List<ToDo>getAllToDosRaw();
}
