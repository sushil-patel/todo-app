package com.todo.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.todo.app.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
  
}