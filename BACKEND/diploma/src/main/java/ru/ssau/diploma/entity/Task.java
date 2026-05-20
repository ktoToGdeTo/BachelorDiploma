package ru.ssau.diploma.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@Table(name = "task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private long id;

    private String title;

    private String description;

    private LocalDateTime created_time;

    private LocalDateTime changed_time;
    
    @Enumerated(EnumType.STRING)
    @ManyToOne
    @JoinColumn(name = "status")
    private TaskStatus status;

    @ManyToOne
    @JoinColumn(name = "created_by", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private User user;


}
