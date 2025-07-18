package Breakable_Toy.BT;

import Breakable_Toy.BT.controller.ToDoController;
import Breakable_Toy.BT.dto.ToDoDto;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class TestUnit {

    ToDoController controller = new ToDoController(); // no autowiring = no DB

    @SuppressWarnings("unchecked")
    private Map<String, String> validate(ToDoDto dto) {
        try {
            Method method = ToDoController.class.getDeclaredMethod("validateToDoDto", ToDoDto.class);
            method.setAccessible(true);
            return (Map<String, String>) method.invoke(controller, dto);
        } catch (Exception e) {
            throw new RuntimeException("Reflection failed: " + e.getMessage(), e);
        }
    }

    @Test
    public void testNullText() {
        ToDoDto dto = new ToDoDto();
        dto.setText(null);
        dto.setPriority("low");
        Map<String, String> errors = validate(dto);
        assertTrue(errors.containsKey("text"));
    }

    @Test
    public void testEmptyText() {
        ToDoDto dto = new ToDoDto();
        dto.setText("   ");
        dto.setPriority("medium");
        Map<String, String> errors = validate(dto);
        assertEquals("Task text is required.", errors.get("text"));
    }

    @Test
    public void testTextTooLong() {
        ToDoDto dto = new ToDoDto();
        dto.setText("a".repeat(101));
        dto.setPriority("high");
        Map<String, String> errors = validate(dto);
        assertTrue(errors.containsKey("text"));
    }

    @Test
    public void testTextWithInvalidCharacters() {
        ToDoDto dto = new ToDoDto();
        dto.setText("DROP TABLE users; 💥");
        dto.setPriority("low");
        Map<String, String> errors = validate(dto);
        assertTrue(errors.containsKey("text"));
    }

    @Test
    public void testPastDueDate() {
        ToDoDto dto = new ToDoDto();
        dto.setText("Valid Task");
        dto.setDueDate(LocalDate.now().minusDays(1).atStartOfDay()); // now LocalDate
        dto.setPriority("medium");
        Map<String, String> errors = validate(dto);
        assertTrue(errors.containsKey("dueDate"));
    }

    @Test
    public void testInvalidPriority() {
        ToDoDto dto = new ToDoDto();
        dto.setText("Task");
        dto.setPriority("urgent");
        Map<String, String> errors = validate(dto);
        assertEquals("Priority must be 'low', 'medium', or 'high'.", errors.get("priority"));
    }

    @Test
    public void testDoneDateWithoutCompletedTrue() {
        ToDoDto dto = new ToDoDto();
        dto.setText("Task");
        dto.setPriority("low");
        dto.setDoneDate(LocalDate.now().atStartOfDay());
        dto.setCompleted(false);
        Map<String, String> errors = validate(dto);
        assertEquals("Cannot set doneDate if task is not marked completed.", errors.get("doneDate"));
    }

    @Test
    public void testDoneDateBeforeCreationDate() {
        ToDoDto dto = new ToDoDto();
        dto.setText("Task");
        dto.setPriority("high");
        dto.setCreationDate(LocalDate.now().atStartOfDay());
        dto.setDoneDate(LocalDate.now().minusDays(2).atStartOfDay());
        dto.setCompleted(true);
        Map<String, String> errors = validate(dto);
        assertEquals("Done date cannot be before creation date.", errors.get("doneDate"));
    }

    @Test
    public void testValidToDo() {
        ToDoDto dto = new ToDoDto();
        dto.setText("Finish essay");
        dto.setPriority("medium");
        dto.setCreationDate(LocalDate.now().minusDays(1).atStartOfDay());
        dto.setDueDate(LocalDate.now().plusDays(3).atStartOfDay());
        dto.setDoneDate(LocalDate.now().atStartOfDay());
        dto.setCompleted(true);

        Map<String, String> errors = validate(dto);
        assertTrue(errors.isEmpty());
    }
}
