package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Long> {
    List<Vacancy> findByIsHiddenFalse();
    Optional<Vacancy> findByIdAndIsHiddenTrue(Long id);
}
