package com.example.courseresgistartionsystem.JWT;

import com.example.courseresgistartionsystem.DTO.AuthenticationRequest;
import com.example.courseresgistartionsystem.DTO.AuthenticationResponse;
import com.example.courseresgistartionsystem.model.Users;
import com.example.courseresgistartionsystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // If we get here, authentication was successful
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtService.generateToken(userDetails);

        Users user = usersRepo.getUsersByUsername(request.getUsername());

        return AuthenticationResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }
}
