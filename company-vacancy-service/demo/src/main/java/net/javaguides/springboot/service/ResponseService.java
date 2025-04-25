package net.javaguides.springboot.service;

import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.exception.ResourceNotFoundException;
import net.javaguides.springboot.model.Company;
import net.javaguides.springboot.model.Response;
import net.javaguides.springboot.model.Vacancy;
import net.javaguides.springboot.repository.ResponseRepository;
import net.javaguides.springboot.repository.VacancyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final VacancyRepository vacancyRepository;

    @Autowired
    public ResponseService(ResponseRepository responseRepository, VacancyRepository vacancyRepository) {
        this.responseRepository = responseRepository;
        this.vacancyRepository = vacancyRepository;
    }

    @Async
    public CompletableFuture<Response> createResponse(Response response, String userName, Long vacancyId) {

        Vacancy vacancy = vacancyRepository.findByIdAndIsHiddenTrue(vacancyId)
                .orElseThrow(() -> new ResourceNotFoundException("Вакансии не существует!"));

        response.setUserName(userName);
        response.setVacancy(vacancy);
        return CompletableFuture.completedFuture(responseRepository.save(response));
    }

    @Async
    public CompletableFuture<List<Response>>getAllResponsesByUser(String username) {
        return CompletableFuture.completedFuture(responseRepository.findByUser(username));
    }

    

}
