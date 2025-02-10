package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}
