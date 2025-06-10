package com.example.courseresgistartionsystem.controller;


import com.example.courseresgistartionsystem.model.Course;

import com.example.courseresgistartionsystem.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@CrossOrigin(origins = "http://localhost:3000")

public class CourseController {

    @Autowired
    CourseService courseService;

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PostMapping("/register-course")
    public ResponseEntity<String> registerCourse(@RequestParam("name") String name,
                                 @RequestParam("email") String emailid,
                                 @RequestParam("coursename") String coursename) {
        courseService.registercourse(name,emailid,coursename);
        return ResponseEntity.ok("Course registered successfully");
    }
//    @GetMapping("/")
//    public String home() {
//        return "Welcome to Course Registration System";
//    }

}
