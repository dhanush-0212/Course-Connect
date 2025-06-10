package com.example.courseresgistartionsystem.service;


import com.example.courseresgistartionsystem.model.Course;
import com.example.courseresgistartionsystem.model.CourseRegistry;
import com.example.courseresgistartionsystem.repository.CourseRepo;
import com.example.courseresgistartionsystem.repository.CourseregistryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepo courseRepo;

    @Autowired
    private CourseregistryRepo courseregistryRepo;

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    public List<CourseRegistry> getenrolledStudents() {
        return courseregistryRepo.findAll();
    }

    public void registercourse(String name, String emailid, String course) {
        CourseRegistry registry = new CourseRegistry(name, emailid, course);
        courseregistryRepo.save(registry);
    }

    public void addCourse(Course course) {
        courseRepo.save(course);
    }

    public void deleteCourse(int id) {
        courseRepo.deleteById(id);
    }

    public Course getCourseById(int id) {
        return courseRepo.findById(id).orElse(null);
    }
}
