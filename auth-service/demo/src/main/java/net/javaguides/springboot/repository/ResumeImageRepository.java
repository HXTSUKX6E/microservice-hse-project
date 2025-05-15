package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.ResumeImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeImageRepository extends JpaRepository<ResumeImage, Long> {
}
