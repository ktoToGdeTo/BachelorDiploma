package ru.ssau.diploma.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import ru.ssau.diploma.entity.dto.UserDto;
import ru.ssau.diploma.exception.UserAlreadyRegisterException;
import ru.ssau.diploma.service.UserService;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto){
        try{
            userService.registerUser(userDto);
        }
        catch (UserAlreadyRegisterException e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("USER ALREADY REGISTER WITH THIS USERNAME");
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDto>> showAllUsers(){
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/delete/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable(name = "username") String username){
        try {
            userService.deleteUser(username);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("ERROR: USER NOT FOUND");
        }
        return ResponseEntity.noContent().build();
    }
}
