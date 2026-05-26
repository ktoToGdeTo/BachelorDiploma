package ru.ssau.diploma.exception;

public class RoleNotFoundException extends RuntimeException {
    public RoleNotFoundException(String role) {
        super("Роль "+ role + " не была найдена.");
    }
}
