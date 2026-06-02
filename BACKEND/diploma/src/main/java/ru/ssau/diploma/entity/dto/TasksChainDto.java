package ru.ssau.diploma.entity.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TasksChainDto {
    private long id;
    private String titleChain;
    private LocalDateTime deadlineTime;
    private List<TaskDto> tasksChain;


}
