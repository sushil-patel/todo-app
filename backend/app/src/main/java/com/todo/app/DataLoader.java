package com.todo.app;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.todo.app.model.Todo;
import com.todo.app.repository.TodoRepository;

// sample file to show temp todos

@Configuration
public class DataLoader {
    @Bean
    ApplicationRunner runner(TodoRepository todoRepository) {
        return args -> {
            todoRepository.save(new Todo("Shower", false));
            todoRepository.save(new Todo("Read", false));
        };
    }
}
