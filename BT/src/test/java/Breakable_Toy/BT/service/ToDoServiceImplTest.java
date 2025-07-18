package Breakable_Toy.BT.service;

import Breakable_Toy.BT.dto.ToDoDto;
import Breakable_Toy.BT.mapper.ToDoMapper;
import Breakable_Toy.BT.repository.ToDoRepo;
import Breakable_Toy.BT.service.impl.ToDoServiceImpl;
import Breakable_Toy.BT.todo.ToDo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ToDoServiceImplTest {

    private ToDoRepo toDoRepo;
    private ToDoServiceImpl toDoService;

    @BeforeEach
    void setup() {
        toDoRepo = mock(ToDoRepo.class);
        toDoService = new ToDoServiceImpl(toDoRepo);
    }

    @Test
    void createToDo_shouldReturnSavedToDo() {
        ToDoDto input = new ToDoDto(null, "Test task", LocalDateTime.now(), null, null, false, "HIGH");
        ToDo mapped = ToDoMapper.mapToToDo(input);
        mapped.setId(1L);
        when(toDoRepo.save(any(ToDo.class))).thenReturn(mapped);

        ToDoDto result = toDoService.createToDo(input);

        assertNotNull(result.getId());
        assertEquals("Test task", result.getText());
        assertEquals("HIGH", result.getPriority());
    }

    @Test
    void getToDoById_shouldReturnToDo() {
        ToDo task = new ToDo(1L, "Sample", LocalDateTime.now(), null, null, false, "LOW");
        when(toDoRepo.findById(1L)).thenReturn(Optional.of(task));

        ToDoDto result = toDoService.getToDoById(1L);
        assertEquals("Sample", result.getText());
    }

    @Test
    void getAllToDos_shouldReturnList() {
        List<ToDo> list = Arrays.asList(
                new ToDo(1L, "First", LocalDateTime.now(), null, null, false, "LOW"),
                new ToDo(2L, "Second", LocalDateTime.now(), null, null, false, "HIGH")
        );

        when(toDoRepo.findAll()).thenReturn(list);

        List<ToDoDto> result = toDoService.getAllToDos();
        assertEquals(2, result.size());
    }

    @Test
    void deleteToDo_shouldRemoveToDo() {
        when(toDoRepo.existsById(1L)).thenReturn(true);

        toDoService.deleteToDo(1L);

        verify(toDoRepo, times(1)).deleteById(1L);
    }
}
