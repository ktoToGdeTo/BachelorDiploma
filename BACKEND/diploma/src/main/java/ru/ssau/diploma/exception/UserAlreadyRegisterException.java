package ru.ssau.diploma.exception;

public class UserAlreadyRegisterException extends RuntimeException {
    public UserAlreadyRegisterException() {
        super("Пользователь уже зарегестрирован с таким username.");
    }
}
