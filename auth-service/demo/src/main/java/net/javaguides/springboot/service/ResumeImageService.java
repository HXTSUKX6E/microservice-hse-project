package net.javaguides.springboot.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.javaguides.springboot.dto.ResumeImageDto;
import net.javaguides.springboot.exception.ResourceNotFoundException;
import net.javaguides.springboot.model.Resume;
import net.javaguides.springboot.model.ResumeImage;
import net.javaguides.springboot.repository.ResumeImageRepository;
import net.javaguides.springboot.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

@Service
public class ResumeImageService {

    private final ResumeImageRepository resumeImageRepository;
    private final ResumeRepository resumeRepository; // существующий
    private final YandexStorageService yandexStorageService;
    private final PresignedUrlService presignedUrlService;
    @Autowired

    public ResumeImageService(ResumeImageRepository resumeImageRepository,
                              ResumeRepository resumeRepository, YandexStorageService yandexStorageService,
                              PresignedUrlService presignedUrlService) {
        this.resumeImageRepository = resumeImageRepository;
        this.resumeRepository = resumeRepository;
        this.yandexStorageService = yandexStorageService;
        this.presignedUrlService = presignedUrlService;
    }

    public ResumeImage uploadResumeImage(Long resumeId, MultipartFile file) throws IOException {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Резюме не найдено"));

        String url = yandexStorageService.uploadFile(file);

        ResumeImage image = new ResumeImage(url, resume);
        return resumeImageRepository.save(image);
    }

    public ResumeImageDto getResumeImage(Long resumeId) {
        ResumeImage image = resumeImageRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Изображение для резюме не найдено"));

        return new ResumeImageDto(image.getResumeImageId(), image.getUrl());
    }

    public byte[] getImageContentByResumeId(Long resumeId) {
        ResumeImage image = resumeImageRepository.findById(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Изображение не найдено"));

        String key = extractKeyFromUrl(image.getUrl());

        return yandexStorageService.downloadFile(key);
    }

    private String extractKeyFromUrl(String url) {
        // Пример: https://storage.yandexcloud.net/bucket-name/uuid_filename.jpg
        int lastSlash = url.lastIndexOf('/');
        return url.substring(lastSlash + 1);
    }


    public List<String> getAllImagePresignedUrlsByResumeId(Long resumeId) {
        if (!resumeRepository.existsById(resumeId)) {
            throw new ResourceNotFoundException("Резюме не найдено");
        }

        List<ResumeImage> images = resumeImageRepository.findAllByResume_ResumeId(resumeId);

        return images.stream()
                .map(image -> {
                    try {
                        // Допустим, у тебя URL вида https://storage.yandexcloud.net/bucket/key
                        // Нужно вытащить key (путь в бакете)
                        String key = extractKeyFromUrl(image.getUrl());

                        // Генерируем временную ссылку на файл, например, на 1 час (3600 секунд)
                        return presignedUrlService.generatePresignedUrl(key, 3600);

                    } catch (Exception e) {
                        // Можно логировать ошибку
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }
}
