package ru.ssau.diploma.service;

import lombok.AllArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.ssau.diploma.entity.Task;
import ru.ssau.diploma.entity.TasksChain;
import ru.ssau.diploma.entity.User;
import ru.ssau.diploma.entity.dto.TaskDto;
import ru.ssau.diploma.entity.dto.TasksChainDto;
import ru.ssau.diploma.exception.TaskNotFoundException;
import ru.ssau.diploma.repository.TaskChainRepository;
import ru.ssau.diploma.repository.TaskRepository;
import ru.ssau.diploma.repository.TaskStatusRepository;
import ru.ssau.diploma.repository.UserRepository;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskStatusRepository taskStatusRepository;
    private final TaskChainRepository taskChainRepository;


    private TaskDto taskToDto(Task task){
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setCreated_time(task.getCreatedTime());
        taskDto.setModified_time(task.getChangedTime());
        taskDto.setCreated_by(task.getUser().getUsername());
        taskDto.setStatus(task.getStatus().getStatusName());
        if(task.getChain() != null) {
            taskDto.setChain_id(task.getChain().getId());
            taskDto.setChain_order(task.getChainOrder());
        }
        return taskDto;
    }

    private TasksChainDto toChainDto(TasksChain tasksChain) {
        TasksChainDto tasksChainDto = new TasksChainDto();
        tasksChainDto.setId(tasksChain.getId());
        tasksChainDto.setTitleChain(tasksChain.getTitleChain());
        tasksChainDto.setDeadlineTime(tasksChain.getDeadlineTime());
        tasksChainDto.setTasksChain(tasksChain.getTasksChain().stream().map(this::taskToDto).toList());
        return tasksChainDto;
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

    public List<TasksChainDto> getChainsByUser(String username){
        List<TasksChain> res = taskChainRepository.findChainsByUserUsername(username);
        return res.stream().map(this::toChainDto).toList();
    }

    public List<TasksChainDto> getAllChains(){
        List<TasksChain> res = taskChainRepository.findAll();
        return res.stream().map(this::toChainDto).toList();
    }

    public void createChain(TasksChainDto tasksChainDto){
        TasksChain newChain = new TasksChain();
        newChain.setTitleChain(tasksChainDto.getTitleChain());
        newChain.setDeadlineTime(tasksChainDto.getDeadlineTime());
        int order = 1;
        for(TaskDto taskDto : tasksChainDto.getTasksChain()){
            Task task = new Task();
            task.setTitle(taskDto.getTitle());
            task.setDescription(taskDto.getDescription());

            task.setChain(newChain);
            task.setChainOrder(order++);

            task.setCreatedTime(LocalDateTime.now());
            task.setChangedTime(LocalDateTime.now());
            task.setStatus(taskStatusRepository.findByStatusName("OPEN"));
            task.setUser(userRepository.findByUsername(taskDto.getCreated_by()).get());
            task.setChainOrder(task.getChainOrder());

            newChain.addTask(task);
        }
        taskChainRepository.save(newChain);
    }
    public void deleteChain(long id){
        taskChainRepository.deleteById(id);
    }
    public TasksChainDto getChainById(long id){
        Optional<TasksChain> chain = taskChainRepository.findById(id);
        return chain.map(this::toChainDto).get();
    }

    public void updateChain(Long chainId, TasksChainDto dto) {
        TasksChain chain = taskChainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Цепочка не найдена"));

        chain.setTitleChain(dto.getTitleChain());
        chain.setDeadlineTime(dto.getDeadlineTime());

        Map<Long, Task> existingTasksMap = chain.getTasksChain().stream()
                .filter(task -> task.getId() > 0)
                .collect(Collectors.toMap(Task::getId, Function.identity()));

        Set<Long> incomingTaskIds = new HashSet<>();
        int order = 0;

        for (TaskDto taskDto : dto.getTasksChain()) {

            if (taskDto.getId() != null && existingTasksMap.containsKey(taskDto.getId())) {

                Task existingTask = existingTasksMap.get(taskDto.getId());

                existingTask.setTitle(taskDto.getTitle());
                existingTask.setDescription(taskDto.getDescription());
                existingTask.setChangedTime(LocalDateTime.now());
                existingTask.setChainOrder(order);

                if (taskDto.getCreated_by() != null) {
                    User user = userRepository.findByUsername(taskDto.getCreated_by())
                            .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
                    existingTask.setUser(user);
                }
                incomingTaskIds.add(taskDto.getId());

            } else {
                Task newTask = new Task();
                newTask.setTitle(taskDto.getTitle());
                newTask.setDescription(taskDto.getDescription());
                newTask.setCreatedTime(LocalDateTime.now());
                newTask.setChangedTime(LocalDateTime.now());
                newTask.setChainOrder(order);

                if (taskDto.getCreated_by() != null) {
                    User user = userRepository.findByUsername(taskDto.getCreated_by())
                            .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
                    newTask.setUser(user);
                }

                chain.addTask(newTask);
            }
            order++;
        }
        chain.getTasksChain().removeIf(task -> !incomingTaskIds.contains(task.getId()));

        taskChainRepository.save(chain);
    }
}
