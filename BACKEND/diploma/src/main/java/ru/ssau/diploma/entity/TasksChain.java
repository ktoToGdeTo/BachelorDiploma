package ru.ssau.diploma.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "tasks_chains")
public class TasksChain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chain_id")
    private long id;

    private String titleChain;

    private LocalDateTime deadlineTime;

    @OneToMany(mappedBy = "chain", fetch = FetchType.LAZY)
    @OrderBy("chainOrder ASC")
    private List<Task> tasksChain = new ArrayList<>();
}
