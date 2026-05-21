package ru.ssau.diploma.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.ssau.diploma.entity.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query(nativeQuery = true, value = "select * from task t join users u on t.created_by = u.user_id where u.username = :username")
    List<Task> getTasksOfCurrentUser(String username);
}
