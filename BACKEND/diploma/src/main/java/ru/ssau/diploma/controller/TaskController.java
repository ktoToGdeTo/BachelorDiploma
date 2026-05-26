package ru.ssau.diploma.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.ssau.diploma.entity.dto.TaskDto;
import ru.ssau.diploma.exception.TaskNotFoundException;
import ru.ssau.diploma.service.TaskService;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/{id}")
    public ResponseEntity<Optional<TaskDto>> getTaskById(@PathVariable(name = "id") Long id){
        Optional<TaskDto> foundedTask = taskService.getTaskById(id);
        if(foundedTask.isPresent()) return ResponseEntity.status(HttpStatus.OK).body(foundedTask);
        else return ResponseEntity.notFound().build();
    }

    @GetMapping()
    public ResponseEntity<List<TaskDto>> getTasksByCurrentUser(Authentication authentication){
        List<TaskDto> tasks = taskService.getTasksUser(authentication);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TaskDto>> getAllTasks(){
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskDto taskDto, Authentication auth){
        try{
            TaskDto createdTask = taskService.createTask(taskDto, auth);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
        }
        catch (UserPrincipalNotFoundException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("ERROR: USER NOT FOUND");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable(name = "id") Long id){
        try{
            taskService.deleteTask(id);
        }
        catch (TaskNotFoundException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> refreshTask(@PathVariable(name = "id") Long id, @RequestBody TaskDto taskDto){
        taskDto.setId(id);
        try {
            taskService.updateTask(taskDto);
        } catch (TaskNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(null);
    }
}
