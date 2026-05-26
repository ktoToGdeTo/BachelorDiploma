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
    private LocalDateTime modified_time;
    private String status;
    private String created_by;
}
