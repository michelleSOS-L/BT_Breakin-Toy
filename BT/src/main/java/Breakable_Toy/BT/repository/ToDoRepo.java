package Breakable_Toy.BT.repository;

import Breakable_Toy.BT.todo.ToDo;
import org.springframework.stereotype.Repository;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class ToDoRepo {
    private final Map<Long, ToDo> store = new HashMap<>();
    private final AtomicLong idCounter = new AtomicLong();

    public ToDo save(ToDo todo) {
        if (todo.getId() == null) {
            todo.setId(idCounter.incrementAndGet());
        }
        store.put(todo.getId(), todo);
        return todo;
    }
    public Optional<ToDo> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<ToDo> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(Long id) {
        store.remove(id);
    }

    public boolean existsById(Long id) {
        return store.containsKey(id);
    }
}