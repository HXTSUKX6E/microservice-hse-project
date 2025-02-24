package net.javaguides.springboot.service;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.CompanyOneDto;
import net.javaguides.springboot.exception.ResourceNotFoundException;
import net.javaguides.springboot.model.Company;
import net.javaguides.springboot.repository.CompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Async
    public CompletableFuture<List<Company>> getAllCompanies() {
        log.info("service get all companies");
        return CompletableFuture.completedFuture(companyRepository.findAll());
    }

    @Async
    public CompletableFuture<Company> createCompany(Company company) {
        log.info("service create company");
        return CompletableFuture.completedFuture(companyRepository.save(company));
    }

    @Async
    public CompletableFuture<CompanyOneDto> getOneCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компании с id: " + id + " не существует!"));
        CompanyOneDto companyOneDto = getCompanyDTO(company);
        log.info("service get one company");
        return CompletableFuture.completedFuture(companyOneDto);
    }

    @Async
    public CompletableFuture<Company> updateCompany(Long id, @Valid Company companyDetails) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компании с id: " + id + " не существует!"));

        company.setInn(companyDetails.getInn());
        company.setKpp(companyDetails.getKpp());
        company.setOgrn(companyDetails.getOgrn());
        company.setAddress(companyDetails.getAddress());
        company.setDirector(companyDetails.getDirector());
        company.setDate_reg(companyDetails.getDate_reg());
        company.setIs_accepted(companyDetails.getIs_accepted());

        Company updatedCompany = companyRepository.save(company);
        return CompletableFuture.completedFuture(updatedCompany);
    }

    @Async
    public CompletableFuture<Map<String, Object>> deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Компании с id: " + id + " не существует!"));

        companyRepository.delete(company);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Компания успешно удалена!");
        return CompletableFuture.completedFuture(ResponseEntity.ok(response).getBody());
    }

    public CompanyOneDto getCompanyDTO(Company company) {
        return new CompanyOneDto(
                company.getCompany_id(),
                company.getInn(),
                company.getKpp(),
                company.getOgrn(),
                company.getAddress(),
                company.getDirector(),
                company.getDate_reg(),
                company.getIs_accepted(),
                company.getVacancies());
    }
}