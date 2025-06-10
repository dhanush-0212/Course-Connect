package com.example.courseresgistartionsystem.service;

import com.example.courseresgistartionsystem.model.Users;
import com.example.courseresgistartionsystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class UserService {
    @Autowired
    UsersRepo usersRepo;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public void add(Users user) {
        Users existinguser=usersRepo.getUsersByUsername(user.getUsername());
        if(existinguser!=null){
            throw new RuntimeException("User already exists");
        }
        if (user.getId()==0){
            Random random = new Random();
            int id = random.nextInt(1000000) + 1;
            while (usersRepo.findById(id).isPresent()) {
                id = random.nextInt(1000000) + 1;
            }
            user.setId(id);
        }
        user.setPassword(encoder.encode(user.getPassword()));
        usersRepo.save(user);
    }

    public List<Users> getAllUsers() {
        return usersRepo.findAll();
    }
    public Users getUserByUsername(String username) {
        return usersRepo.getUsersByUsername(username);
    }
}
