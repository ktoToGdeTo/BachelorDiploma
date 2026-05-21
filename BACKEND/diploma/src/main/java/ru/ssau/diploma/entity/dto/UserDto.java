package ru.ssau.diploma.entity.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserDto {
    private long id;
    private String firstName;
    private String lastName;
    private LocalDateTime registerDate;
    private LocalDate birthDate;
    private String username;
    private String password;
}
