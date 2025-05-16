package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.ResumeImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeImageRepository extends JpaRepository<ResumeImage, Long> {
    List<ResumeImage> findAllByResume_ResumeId(Long resumeId);
}
