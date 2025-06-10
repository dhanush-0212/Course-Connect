package com.example.courseresgistartionsystem.controller;

import com.example.courseresgistartionsystem.model.RegistrationRequest;
import com.example.courseresgistartionsystem.model.Users;
import com.example.courseresgistartionsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegistrationRequest registrationRequest) {
        Users user = new Users();
        user.setUsername(registrationRequest.getUsername());
        user.setPassword(registrationRequest.getPassword());
        user.setRole(registrationRequest.getRole() != null &&
                                            registrationRequest.getRole().equalsIgnoreCase("ADMIN")?"ADMIN" : "USER");

        userService.add(user);
        return ResponseEntity.ok("User registered successfully");
    }
}
