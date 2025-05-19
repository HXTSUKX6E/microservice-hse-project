package net.javaguides.springboot.service;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.CompanyOneDto;
import net.javaguides.springboot.exception.ResourceNotFoundException;
import net.javaguides.springboot.model.Company;
import net.javaguides.springboot.repository.CompanyRepository;
import net.javaguides.springboot.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JwtUtil jwtUtil;

    public CompanyService(CompanyRepository companyRepository,
                          JwtUtil jwtUtil) {
        this.companyRepository = companyRepository;
        this.jwtUtil = jwtUtil;
    }

    @Async
    public CompletableFuture<List<Company>> getAllCompanies() {
        log.info("service get all companies");
        return CompletableFuture.completedFuture(companyRepository.findAll());
    }

    @Async
    public CompletableFuture<List<Company>> getMyCompanies(String token) {
        String username = jwtUtil.extractUsername(token);
        return CompletableFuture.completedFuture(companyRepository.findByUserName(username));
    }

    @Async
    public CompletableFuture<Company> createCompany(Company company) {
        log.info("service create company");
        return CompletableFuture.completedFuture(companyRepository.save(company));
    }

    @Async
    public CompletableFuture<CompanyOneDto> getOneCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компания не найдена!"));
        CompanyOneDto companyOneDto = new CompanyOneDto(company);
        log.info("service get one company");
        return CompletableFuture.completedFuture(companyOneDto);
    }

    @Async
    public CompletableFuture<Company> updateCompany(Long id, @Valid Company companyDetails) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компания не найдена!"));
        companyDetails.setCompany_id(company.getCompany_id());
        companyDetails.setVacancies(company.getVacancies());

        return CompletableFuture.completedFuture(companyRepository.save(companyDetails));
    }

    @Async
    public CompletableFuture<Company> acceptCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компания не найдена!"));
        company.setIs_accepted(true);
        company.setVacancies(company.getVacancies());
        return CompletableFuture.completedFuture(companyRepository.save(company));
    }

    @Async
    public CompletableFuture<Map<String, Object>> deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компания не найдена!"));
        companyRepository.delete(company);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Компания успешно удалена!");
        return CompletableFuture.completedFuture(ResponseEntity.ok(response).getBody());
    }

    @Async
    public CompletableFuture<Map<String, Object>> deleteMyCompany(Long id, String token) {
        String username = jwtUtil.extractUsername(token);
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компания не найдена!"));
        if (!company.getUserName().equals(username)) {
            throw new RuntimeException("Нет доступа!");
        }
        companyRepository.delete(company);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Компания успешно удалена!");
        return CompletableFuture.completedFuture(ResponseEntity.ok(response).getBody());
    }

    @Async
    public CompletableFuture<Company> updateMyCompany(Long id, Company companyDetails, String token) {
        String username = jwtUtil.extractUsername(token);
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компания не найдена!"));
        if (!company.getUserName().equals(username)) {
            throw new RuntimeException("Нет доступа!");
        }
        if (company.getIs_accepted()) {
            throw new ResourceNotFoundException("Компания верефицирована! Невозможно изменить информацию!");
        }
        companyDetails.setCompany_id(company.getCompany_id());
        companyDetails.setVacancies(company.getVacancies());
//        companyDetails.setIs_accepted(false);
        companyDetails.setUserName(company.getUserName());

        return CompletableFuture.completedFuture(companyRepository.save(companyDetails));
    }
}