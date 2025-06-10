package com.example.courseresgistartionsystem;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class passwordgenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        String password="admin1234";
        String encodedPassword = encoder.encode(password);
        System.out.println(encodedPassword +" :");
    }

}
