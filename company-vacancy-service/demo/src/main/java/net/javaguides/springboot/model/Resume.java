package net.javaguides.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class Resume
{
    @Id
    private Long resume_id;

    @Column(nullable = false)
    private String education;

    @Column(nullable = false)
    private String skills;

    @Column(nullable = false)
    private Date birthday;

    private String gender;

    @Column(nullable = false)
    private String full_name;

    @Column(nullable = false)
    private String contact;

    @Column(length = 1000)
    private String description;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private List<Achievement> achievements = new ArrayList<>();

    public Resume() {
    }

    public Resume(String education, String skills, Date birthday, String gender, String full_name, String contact, String description) {
        this.education = education;
        this.skills = skills;
        this.birthday = birthday;
        this.gender = gender;
        this.full_name = full_name;
        this.contact = contact;
        this.description = description;
    }
}
