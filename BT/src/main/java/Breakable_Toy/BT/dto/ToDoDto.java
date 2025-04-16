package Breakable_Toy.BT.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ToDoDto {
    private Long id;
    private String text;
    private LocalDateTime creationDate;
    private LocalDateTime dueDate;
    private LocalDateTime doneDate;
    private boolean completed=false;
    private String priority;

}
