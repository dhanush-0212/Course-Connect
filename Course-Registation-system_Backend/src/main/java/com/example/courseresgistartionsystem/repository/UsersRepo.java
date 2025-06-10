package com.example.courseresgistartionsystem.repository;

import com.example.courseresgistartionsystem.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepo extends JpaRepository<Users, Integer> {

    Users getUsersByUsername(String username);
}
