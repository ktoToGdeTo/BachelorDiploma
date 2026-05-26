package ru.ssau.diploma.entity.dto;

import lombok.Getter;
import lombok.Setter;
import ru.ssau.diploma.entity.Role;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
    private List<RoleDto> roles;
}
