package com.todo.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.todo.app.model.Todo;
import com.todo.app.repository.TodoRepository;

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
}
