package com.todo.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.todo.app.model.Todo;
import com.todo.app.repository.TodoRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/todos")
public class TodoController {
    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Todo> list() {
        return todoRepository.findAll();
    }

    @PostMapping
    public Todo add(@RequestBody Todo todo) {
        todo.setId(null);
        return todoRepository.save(todo);
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody Todo newTodo) {
        return todoRepository.findById(id).map(todo -> {
            todo.setTitle(newTodo.getTitle());
            todo.setCompleted(newTodo.isCompleted());
            return todoRepository.save(todo);
        }).orElseThrow(() -> new RuntimeException("todo not found"));
    }
}
