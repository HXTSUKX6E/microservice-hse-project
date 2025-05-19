package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VacancyRepository extends JpaRepository<Vacancy, Long> {
    List<Vacancy> findByIsHiddenTrue();

    @Query("SELECT v FROM Vacancy v WHERE v.vacancy_id = :id AND v.isHidden = true")
    Optional<Vacancy> findByIdAndHidden(@Param("id") Long id);

    List<Vacancy> findByCompany_userName(String username);
}
