package net.javaguides.springboot.service;

import net.javaguides.springboot.exception.ResourceNotFoundException;
import net.javaguides.springboot.model.Resume;
import net.javaguides.springboot.model.ResumeImage;
import net.javaguides.springboot.repository.ResumeImageRepository;
import net.javaguides.springboot.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeImageService {

    private final ResumeImageRepository resumeImageRepository;
    private final ResumeRepository resumeRepository; // существующий
    private final YandexStorageService yandexStorageService;
    @Autowired

    public ResumeImageService(ResumeImageRepository resumeImageRepository, ResumeRepository resumeRepository, YandexStorageService yandexStorageService) {
        this.resumeImageRepository = resumeImageRepository;
        this.resumeRepository = resumeRepository;
        this.yandexStorageService = yandexStorageService;
    }

    public ResumeImage uploadResumeImage(Long resumeId, MultipartFile file) throws IOException {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Резюме не найдено"));

        String url = yandexStorageService.uploadFile(file);

        ResumeImage image = new ResumeImage(url, resume);
        return resumeImageRepository.save(image);
    }
}
