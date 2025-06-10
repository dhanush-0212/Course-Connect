package com.example.courseresgistartionsystem.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;




@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CourseRegistry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String email;
    private String coursename;

    public CourseRegistry(String name, String email, String coursename) {
        this.name = name;
        this.email = email;
        this.coursename = coursename;
    }
}
