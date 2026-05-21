package ru.ssau.diploma.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import ru.ssau.diploma.entity.dto.UserDto;
import ru.ssau.diploma.service.UserService;

@RestController
@AllArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    @PutMapping("/resetpassword")
    public ResponseEntity<Void> resetPasswordUser(@RequestBody UserDto user){
        try{
            userService.updatePassword(user);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        return ResponseEntity.ok().build();
    }

}
