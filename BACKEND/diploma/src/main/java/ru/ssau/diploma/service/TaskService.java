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

    public TasksChain updateChain(Long chainId, TasksChainDto dto) {
        // 1. Находим цепочку
        TasksChain chain = taskChainRepository.findById(chainId)
                .orElseThrow(() -> new RuntimeException("Цепочка не найдена"));

        // 2. Обновляем поля самой цепочки
        chain.setTitleChain(dto.getTitleChain());
        chain.setDeadlineTime(dto.getDeadlineTime());

        // 3. Собираем Map существующих задач для быстрого поиска по ID
        // ВАЖНО: Так как в сущности Task поле id имеет тип long (примитив),
        // у новых задач (которые еще не в БД) оно равно 0. Поэтому фильтруем по > 0.
        Map<Long, Task> existingTasksMap = chain.getTasksChain().stream()
                .filter(task -> task.getId() > 0)
                .collect(Collectors.toMap(Task::getId, Function.identity()));

        // Множество ID задач, которые пришли с фронта (чтобы потом понять, какие удалить)
        Set<Long> incomingTaskIds = new HashSet<>();
        int order = 0; // Счетчик для сохранения нового порядка (Drag&Drop)

        // 4. Проходимся по задачам из DTO (в том порядке, в котором их перетащил пользователь)
        for (TaskDto taskDto : dto.getTasksChain()) {

            // В DTO поле id должно быть Long (объект), чтобы можно было проверить на null
            if (taskDto.getId() != null && existingTasksMap.containsKey(taskDto.getId())) {

                // --- ВАРИАНТ А: ЗАДАЧА УЖЕ СУЩЕСТВУЕТ -> ОБНОВЛЯЕМ ЕЁ ---
                Task existingTask = existingTasksMap.get(taskDto.getId());

                existingTask.setTitle(taskDto.getTitle());
                existingTask.setDescription(taskDto.getDescription());
                existingTask.setChangedTime(LocalDateTime.now()); // Обновляем время изменения
                existingTask.setChainOrder(order);                // Сохраняем новый порядок

                // Обновляем исполнителя, если он изменился
                if (taskDto.getCreated_by() != null) {
                    // Адаптируйте этот поиск под ваш репозиторий (по ID или по username)
                    User user = userRepository.findByUsername(taskDto.getCreated_by())
                            .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
                    existingTask.setUser(user);
                }

                // Запоминаем, что эта задача пришла с фронта
                incomingTaskIds.add(taskDto.getId());

            } else {

                // --- ВАРИАНТ Б: ЗАДАЧИ НЕТ В БД -> СОЗДАЕМ НОВУЮ ---
                Task newTask = new Task();
                newTask.setTitle(taskDto.getTitle());
                newTask.setDescription(taskDto.getDescription());
                newTask.setCreatedTime(LocalDateTime.now());
                newTask.setChangedTime(LocalDateTime.now());
                newTask.setChainOrder(order);

                // Устанавливаем статус по умолчанию (если нужно, раскомментируйте)
                // newTask.setStatus(defaultTaskStatus);

                // Устанавливаем исполнителя
                if (taskDto.getCreated_by() != null) {
                    User user = userRepository.findByUsername(taskDto.getCreated_by())
                            .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
                    newTask.setUser(user);
                }

                // ИСПОЛЬЗУЕМ ВАШ МЕТОД addTask!
                // Он сам корректно установит двустороннюю связь (newTask.setChain(this))
                chain.addTask(newTask);
            }

            order++; // Увеличиваем порядок для следующей задачи
        }

        // 5. УДАЛЕНИЕ ЗАДАЧ (Магия orphanRemoval = true)
        // Нам НЕ НУЖНО вызывать taskRepository.delete().
        // Достаточно просто удалить задачу из коллекции chain.getTasksChain().
        // При сохранении цепочки Hibernate сам выполнит DELETE в базе для "осиротевших" задач.
        chain.getTasksChain().removeIf(task -> !incomingTaskIds.contains(task.getId()));

        // 6. Сохраняем цепочку.
        // Благодаря cascade = CascadeType.ALL, Hibernate сам:
        // - Обновит существующие задачи
        // - Вставит новые задачи (INSERT)
        // - Удалит те, что мы убрали из списка (DELETE)
        return taskChainRepository.save(chain);
    }
}
