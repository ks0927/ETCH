package com.ssafy.etch.project.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "tech_code")
@Getter
public class TechCodeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String techCategory;

    @Column(nullable = false)
    private String codeName;
}
