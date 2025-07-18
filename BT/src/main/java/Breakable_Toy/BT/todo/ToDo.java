package Breakable_Toy.BT.todo;
/*
Text (required). Max length is 120 chars.
A due date (optional).
Done/undone flag
A done date. When the “to do” is marked as done this date is set
Priority (required). Options: High, Medium and Low.
Creation date.
*/
import com.fasterxml.jackson.annotation.JsonTypeId;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ToDo {

    // @(Strategy= GenerationType.IDENTITY)
    @JsonTypeId
    private Long id;
    private String text;
    private LocalDateTime creationDate;
    private LocalDateTime dueDate;
    private LocalDateTime doneDate;
    private boolean completed=false;
    private String priority;

}
