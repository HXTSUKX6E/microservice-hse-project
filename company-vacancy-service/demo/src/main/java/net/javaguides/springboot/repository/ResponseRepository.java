package net.javaguides.springboot.repository;

import jakarta.validation.constraints.NotNull;
import net.javaguides.springboot.model.Response;
import net.javaguides.springboot.model.Vacancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    List<Response> findByUserName(@NotNull String userName);

    List<Response> findByVacancy(Vacancy vacancy);
}
