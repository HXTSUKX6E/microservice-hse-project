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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final VacancyRepository vacancyRepository;
    private final KafkaProducerService kafkaProducerService;

    @Autowired
    public ResponseService(ResponseRepository responseRepository, VacancyRepository vacancyRepository , KafkaProducerService kafkaProducerService) {
        this.responseRepository = responseRepository;
        this.vacancyRepository = vacancyRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    @Async
    public CompletableFuture<Response> createResponse(Response response, String userName, Long vacancyId) {

        Vacancy vacancy = vacancyRepository.findByIdAndHidden(vacancyId)
                .orElseThrow(() -> new ResourceNotFoundException("Вакансии не существует!"));

        response.setUserName(userName);
        response.setVacancy(vacancy);
        // логика отправки в notification-service:
        log.info("Событие отправлено");
        kafkaProducerService.sendResponseNotification(userName, vacancy.getName(), vacancy.getCompany().getUserName());
        return CompletableFuture.completedFuture(responseRepository.save(response));
    }

    @Async
    public CompletableFuture<List<Response>> getAllResponsesByUser(String username) {
        return CompletableFuture.supplyAsync(() -> {
            List<Response> responses = responseRepository.findByUserName(username);
            // Модифицируем каждое поле
            responses.forEach(response -> {
                response.setViewed(true); // Устанавливаем поле viewed в true
            });

            return responseRepository.saveAll(responses); // Сохраняем изменения
        });
    }

    @Async
    public CompletableFuture<List<Response>>getAllResponsesByVacancy(Long vacancyId, String username) {
        Vacancy vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() -> new ResourceNotFoundException("Вакансия не найдена!"));
        Company company = vacancy.getCompany();
        if (!company.getUserName().equals(username)) {
            throw new AccessDeniedException("Только создатель компании может просматривать отклики!");
        }
        return CompletableFuture.completedFuture(responseRepository.findByVacancy(vacancy));
    }

}
