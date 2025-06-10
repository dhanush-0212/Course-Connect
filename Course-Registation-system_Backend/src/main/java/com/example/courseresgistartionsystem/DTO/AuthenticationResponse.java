package com.example.courseresgistartionsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class AuthenticationResponse {
    private String token;
    private String username;
    private String role;
}
