package net.javaguides.springboot.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "resume_image")
@Getter
@Setter
public class ResumeImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resumeImageId;

    @Column(nullable = false)
    private String url;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    public ResumeImage() {}

    public ResumeImage(String url, Resume resume) {
        this.url = url;
        this.resume = resume;
    }
}
