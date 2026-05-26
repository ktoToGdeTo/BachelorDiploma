package ru.ssau.diploma.service;

import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.ssau.diploma.entity.Task;
import ru.ssau.diploma.entity.User;
import ru.ssau.diploma.entity.dto.TaskDto;
import ru.ssau.diploma.exception.TaskNotFoundException;
import ru.ssau.diploma.repository.TaskRepository;
import ru.ssau.diploma.repository.TaskStatusRepository;
import ru.ssau.diploma.repository.UserRepository;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskStatusRepository taskStatusRepository;

    private TaskDto taskToDto(Task task){
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setCreated_time(task.getCreatedTime());
        taskDto.setModified_time(task.getChangedTime());
        taskDto.setCreated_by(task.getUser().getUsername());
        taskDto.setStatus(task.getStatus().getStatusName());
        return taskDto;
    }


    public Optional<TaskDto> getTaskById(long id){
        Optional<Task> task = taskRepository.findById(id);
        return task.map(this::taskToDto);
    }

    public TaskDto createTask(TaskDto taskDto, Authentication authentication) throws UserPrincipalNotFoundException{
        Optional<User> user = userRepository.findByUsername(authentication.getName());
        if(user.isEmpty()) throw new UserPrincipalNotFoundException(authentication.getName());
        User foundedUser = user.get();
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setCreatedTime(LocalDateTime.now());
        task.setChangedTime(LocalDateTime.now());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskStatusRepository.findByStatusName(taskDto.getStatus()));
        task.setUser(foundedUser);
        taskRepository.save(task);
        return taskToDto(task);
    }

    public List<TaskDto> getTasksUser(Authentication authentication){
        List<Task> tasks = taskRepository.getTasksOfCurrentUser(authentication.getName());
        return tasks.stream().map(this::taskToDto).toList();
    }

    public List<TaskDto> getAllTasks(){
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream().map(this::taskToDto).toList();
    }

    public void deleteTask(long id) {
        Optional<Task> foundTask = taskRepository.findById(id);
        if(foundTask.isEmpty()) throw new TaskNotFoundException();
        taskRepository.deleteById(id);
    }

    public void updateTask(TaskDto taskDto) throws TaskNotFoundException {
        Optional<Task> foundTask = taskRepository.findById(taskDto.getId());
        if(foundTask.isEmpty()) throw new TaskNotFoundException();
        Task task = foundTask.get();
        task.setTitle(taskDto.getTitle());
        task.setChangedTime(LocalDateTime.now());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskStatusRepository.findByStatusName(taskDto.getStatus()));
        taskRepository.save(task);
    }
}
