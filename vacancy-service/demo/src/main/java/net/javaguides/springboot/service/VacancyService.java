package net.javaguides.springboot.service;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.context.SecurityContextHolder;
import net.javaguides.springboot.dto.CompanyRequest;
import net.javaguides.springboot.dto.VacancyDto;
import net.javaguides.springboot.exception.CompanyNotApprovedException;
import net.javaguides.springboot.model.Company;
import net.javaguides.springboot.model.Vacancy;
import net.javaguides.springboot.repository.VacancyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class VacancyService {

    private final VacancyRepository vacancyRepository;
    private final RestTemplate restTemplate;

    public VacancyService(RestTemplate restTemplate, VacancyRepository vacancyRepository) {
        this.restTemplate = restTemplate;
        this.vacancyRepository = vacancyRepository;
    }

    public Vacancy createVacancy(VacancyDto vacancyDto) {
        long companyId = vacancyDto.getCompany_id();
        String url = "http://localhost:8083/api/company/" + companyId;
        String token = getCurrentUserToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<CompanyRequest> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    CompanyRequest.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                CompanyRequest companyRequest = response.getBody();

                if (!companyRequest.getIs_accepted()) {
                    throw new CompanyNotApprovedException("Компания с id: " + companyId + " не одобрена.");
                }

                Company company = getCompany(companyId, companyRequest);
                Vacancy newVacancy = getVacancy(vacancyDto, company, companyRequest);

                vacancyRepository.save(newVacancy);
                return newVacancy;
            } else {
                throw new CompanyNotApprovedException("Компания с id: " + companyId + " не найдена.");
            }
        } catch (Exception e) {
            throw new CompanyNotApprovedException("Ошибка при проверке компании: " + e.getMessage());
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
        newVacancy.setAddress(companyRequest.getAddress());
        newVacancy.setSchedule(vacancyDto.getSchedule());
        newVacancy.setHours(vacancyDto.getHours());
        newVacancy.setIs_educated(vacancyDto.getIs_educated());
        return newVacancy;
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