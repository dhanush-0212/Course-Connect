package com.example.courseresgistartionsystem.controller;

import com.example.courseresgistartionsystem.DTO.AuthenticationRequest;
import com.example.courseresgistartionsystem.DTO.AuthenticationResponse;
import com.example.courseresgistartionsystem.JWT.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
