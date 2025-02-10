package net.javaguides.springboot.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class ResumeDTO {
    private String education;
    private String skills;
    private Date birthday;
    private String gender;
    private String full_name;
    private String contact;
    private String description;

    public ResumeDTO(String education, String skills, Date birthday, String gender, String full_name, String contact, String description) {
        this.education = education;
        this.skills = skills;
        this.birthday = birthday;
        this.gender = gender;
        this.full_name = full_name;
        this.contact = contact;
        this.description = description;
    }
}