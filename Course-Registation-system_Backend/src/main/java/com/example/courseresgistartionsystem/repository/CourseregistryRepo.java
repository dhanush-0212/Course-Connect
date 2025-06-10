package com.example.courseresgistartionsystem.repository;

import com.example.courseresgistartionsystem.model.CourseRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseregistryRepo extends JpaRepository<CourseRegistry,Integer> {

}
