package net.javaguides.springboot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResumeImageDto {
    private Long id;
    private String imageUrl;

    public ResumeImageDto(Long id, String imageUrl) {
        this.id = id;
        this.imageUrl = imageUrl;
    }
}