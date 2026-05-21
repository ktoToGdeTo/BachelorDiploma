package ru.ssau.diploma.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.ssau.diploma.entity.User;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getAuthorizatedUser(Authentication auth) {
        Map<String, Object> user = new LinkedHashMap<>();
        user.put("username", auth.getName());
        user.put("roles", auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).filter(a -> a.contains("ROLE_")).toList());
        user.put("userId", ((User) auth.getPrincipal()).getId());

        return ResponseEntity.ok(user);
    }

    @GetMapping("/success")
    public String success() {
        return "Login successful";
    }

    @GetMapping("/error")
    public String error() {
        return "Login failed";
    }


}
