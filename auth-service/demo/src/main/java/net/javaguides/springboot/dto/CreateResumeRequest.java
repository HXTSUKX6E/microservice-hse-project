package net.javaguides.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CreateResumeRequest {
    private String education;
    private String placeEducation;
    private String skills;
    private Date birthday;
    private String gender;
    private String fullName;
    private String phone;
    private String contact;
    private String description;
//    private Long userId;  // Или private User user;
}
