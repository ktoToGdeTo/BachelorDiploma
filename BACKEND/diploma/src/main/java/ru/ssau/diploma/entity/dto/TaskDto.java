package ru.ssau.diploma.entity.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskDto {
    private long id;
    private String title;
    private String description;
    private LocalDateTime created_time;
    private LocalDateTime changed_time;
    private String status;
    private long created_at;
}
