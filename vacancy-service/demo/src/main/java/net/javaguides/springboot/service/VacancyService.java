package net.javaguides.springboot.service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import net.javaguides.springboot.dto.CompanyRequest;
import net.javaguides.springboot.dto.VacancyDto;
import net.javaguides.springboot.exception.CompanyNotApprovedException;
import net.javaguides.springboot.model.Company;
import net.javaguides.springboot.model.Vacancy;
import net.javaguides.springboot.repository.VacancyRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class VacancyService {

    private final WebClient webClient;
    private final VacancyRepository vacancyRepository;

    @Autowired
    public VacancyService(VacancyRepository vacancyRepository, WebClient.Builder webClientBuilder) {
        this.vacancyRepository = vacancyRepository;
        this.webClient = webClientBuilder.baseUrl("http://localhost:8083").build();
    }

    @Async("taskExecutor")
    public CompletableFuture<Vacancy> createVacancy(VacancyDto vacancyDto) {
        long companyId = vacancyDto.getCompany_id();
        String token = getCurrentUserToken();
        log.info("token: {}", token);
        try {
            CompanyRequest companyRequest = webClient.get()
                    .uri("/api/company/" + companyId)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .onStatus(
                            status -> !status.is2xxSuccessful(),
                            clientResponse -> {
                                int statusCode = clientResponse.statusCode().value();
                                if (clientResponse.statusCode().is5xxServerError()) {
                                    return Mono.error(new CompanyNotApprovedException("Ошибка сервера при получении данных о компании."));
                                } else if (clientResponse.statusCode().is4xxClientError()) {
                                    return Mono.error(new CompanyNotApprovedException("Компания с id: " + companyId + " не найдена."));
                                } else {
                                    return Mono.error(new CompanyNotApprovedException("Неизвестная ошибка при запросе данных о компании."));
                                }
                            }
                    )
                    .bodyToMono(CompanyRequest.class)
                    .block();
            assert companyRequest != null;
            if (!companyRequest.getIs_accepted()) {
                throw new CompanyNotApprovedException("Компания с id: " + companyId + " не одобрена.");
            }
            Company company = getCompany(companyId, companyRequest);
            Vacancy newVacancy = getVacancy(vacancyDto, company, companyRequest);

            return CompletableFuture.completedFuture(vacancyRepository.save(newVacancy));
        }
        catch (WebClientException ex) {
            throw new CompanyNotApprovedException("Ошибка на стороне сервера!");
        }
    }

    private static Company getCompany(long companyId, CompanyRequest companyRequest) {
        Company company = new Company();

        company.setCompany_id(companyId);
        company.setInn(companyRequest.getInn());
        company.setKpp(companyRequest.getKpp());
        company.setOgrn(companyRequest.getOgrn());
        company.setAddress(companyRequest.getAddress());
        company.setDirector(companyRequest.getDirector());
        company.setDate_reg(companyRequest.getDate_reg());
        company.setIs_accepted(true);
        return company;
    }

    private static Vacancy getVacancy(VacancyDto vacancyDto, Company company, CompanyRequest companyRequest) {
        Vacancy newVacancy = new Vacancy();

        newVacancy.setTitle(vacancyDto.getTitle());
        newVacancy.setDescription(vacancyDto.getDescription());
        newVacancy.setCompany(company);
        newVacancy.setContact(vacancyDto.getContact());
        newVacancy.setExperience(vacancyDto.getExperience());
        newVacancy.setFormat(vacancyDto.getFormat());
        newVacancy.setAddress(companyRequest.getAddress()); // default address
        newVacancy.setSchedule(vacancyDto.getSchedule());
        newVacancy.setHours(vacancyDto.getHours());
        newVacancy.setIs_educated(vacancyDto.getIs_educated());
        return newVacancy;
    }

    public String getCurrentUserToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getCredentials() instanceof String) {
            return (String) authentication.getCredentials();  // Достаём токен
        } else {
            throw new RuntimeException("Токен не найден в контексте безопасности.");
        }
    }
}