package com.example.courseresgistartionsystem.service;

import com.example.courseresgistartionsystem.model.Users;
import com.example.courseresgistartionsystem.model.userprincipal;
import com.example.courseresgistartionsystem.repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserdetailService implements UserDetailsService {

    @Autowired
    UsersRepo usersRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user=usersRepo.getUsersByUsername(username);
        if(user==null){
            throw new UsernameNotFoundException("username is not found");
        }
        return new userprincipal(user);

    }
}
