package com.example.courseresgistartionsystem.controller;

import com.example.courseresgistartionsystem.model.Course;
import com.example.courseresgistartionsystem.model.CourseRegistry;
import com.example.courseresgistartionsystem.model.Users;
import com.example.courseresgistartionsystem.service.CourseService;
import com.example.courseresgistartionsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @GetMapping("/enrollments")
    public ResponseEntity<List<CourseRegistry>> getAllEnrollments() {
        return ResponseEntity.ok(courseService.getenrolledStudents());
    }

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/add-course")
    public ResponseEntity<String> addCourse(@RequestBody Course course) {
        courseService.addCourse(course);
        return ResponseEntity.ok("Course added successfully");
    }

    @DeleteMapping("/delete-course/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable int id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok("Course deleted successfully");
    }
}
