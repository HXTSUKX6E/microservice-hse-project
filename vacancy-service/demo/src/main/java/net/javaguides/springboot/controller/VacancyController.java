package net.javaguides.springboot.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.VacancyDto;
import net.javaguides.springboot.model.Vacancy;
import net.javaguides.springboot.repository.VacancyRepository;
import net.javaguides.springboot.service.VacancyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "http://localhost:5432")
@RestController
@EnableAsync
@Slf4j
// base URL
@RequestMapping("/api/")
public class VacancyController {

    private final VacancyService vacancyService;

    @Autowired
    public VacancyController(VacancyService vacancyService) {
        this.vacancyService = vacancyService;
    }

    // create
    @PreAuthorize("hasRole('ROLE_3') || hasRole('ROLE_1')")
    @PostMapping("/vacancy")
    public Vacancy createVacancy(@RequestBody @Valid VacancyDto vacancyDto) throws ExecutionException, InterruptedException {
        return vacancyService.createVacancy(vacancyDto).get();
    }

    private String getCurrentUserToken() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getCredentials() instanceof String) {
            return (String) authentication.getCredentials();  // Достаём токен
        } else {
            throw new RuntimeException("Токен не найден в контексте безопасности.");
        }
    }
}
