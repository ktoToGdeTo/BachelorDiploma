package ru.ssau.diploma.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.ssau.diploma.entity.TaskStatus;

public interface TaskStatusRepository extends JpaRepository<TaskStatus, Long> {
    TaskStatus findByStatusName(String statusName);
}
