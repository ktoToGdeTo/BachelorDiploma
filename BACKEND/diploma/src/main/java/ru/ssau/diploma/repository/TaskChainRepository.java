package ru.ssau.diploma.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.ssau.diploma.entity.TasksChain;

import java.util.List;

public interface TaskChainRepository extends JpaRepository<TasksChain, Long> {

    @Query("SELECT DISTINCT c FROM TasksChain c " +
            "JOIN FETCH c.tasksChain " +
            "WHERE c.id IN (" +
            "    SELECT t.chain.id FROM Task t WHERE t.user.username = :username" +
            ")")
    List<TasksChain> findChainsByUserUsername(@Param("username") String username);
}
