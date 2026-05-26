package ru.ssau.diploma.exception;

public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException() {
        super("Задача не была найдена.");
    }
}
