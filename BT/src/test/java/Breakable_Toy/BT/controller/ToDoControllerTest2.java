package Breakable_Toy.BT.controller;

import Breakable_Toy.BT.dto.ToDoDto;
import Breakable_Toy.BT.service.ToDoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class ToDoControllerTest2 {

    private MockMvc mockMvc;
    private ToDoService mockToDoService;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        mockToDoService = Mockito.mock(ToDoService.class);  // manual mocking
        ToDoController controller = new ToDoController();
        controller.todoService = mockToDoService; // inject manually

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testCreateToDo() throws Exception {
        ToDoDto todo = new ToDoDto(1L, "Test Task", LocalDateTime.now(), null, null, false, "HIGH");

        when(mockToDoService.createToDo(any(ToDoDto.class))).thenReturn(todo);

        mockMvc.perform(post("/api/ToDos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(todo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text").value("Test Task"))
                .andExpect(jsonPath("$.priority").value("HIGH"));
    }

    @Test
    public void testGetAllToDos() throws Exception {
        when(mockToDoService.getAllToDos()).thenReturn(Collections.singletonList(
                new ToDoDto(1L, "Sample", LocalDateTime.now(), null, null, false, "LOW")
        ));

        mockMvc.perform(get("/api/ToDos/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].text").value("Sample"));
    }

    @Test
    public void testDeleteToDo() throws Exception {
        mockMvc.perform(delete("/api/ToDos/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted Successfully"));
    }
}