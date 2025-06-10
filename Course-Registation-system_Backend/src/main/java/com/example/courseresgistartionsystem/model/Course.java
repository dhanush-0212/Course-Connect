package com.example.courseresgistartionsystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Course {

    @Id
    private int courseId;
    private String courseName;
    private String trainer;
    private String durationInWeeks;

}
