package net.javaguides.springboot.service;

import net.javaguides.springboot.dto.ResumeImageDto;
import net.javaguides.springboot.dto.ReturnStatusDeleteDto;
import net.javaguides.springboot.exception.ResourceNotFoundException;
import net.javaguides.springboot.model.Resume;
import net.javaguides.springboot.model.ResumeImage;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.repository.ResumeImageRepository;
import net.javaguides.springboot.repository.ResumeRepository;
import net.javaguides.springboot.repository.UserRepository;
import net.javaguides.springboot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

@Service
public class ResumeImageService {

    private final ResumeImageRepository resumeImageRepository;
    private final ResumeRepository resumeRepository; // существующий
    private final YandexStorageService yandexStorageService;
    private final PresignedUrlService presignedUrlService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    @Autowired

    public ResumeImageService(ResumeImageRepository resumeImageRepository,
                              ResumeRepository resumeRepository, YandexStorageService yandexStorageService,
                              PresignedUrlService presignedUrlService,
                              UserRepository userRepository, JwtUtil jwtUtil) {
        this.resumeImageRepository = resumeImageRepository;
        this.resumeRepository = resumeRepository;
        this.yandexStorageService = yandexStorageService;
        this.presignedUrlService = presignedUrlService;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
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


    public List<ResumeImageDto> getAllImagePresignedUrlsByResumeId(Long resumeId) {
        if (!resumeRepository.existsById(resumeId)) {
            throw new ResourceNotFoundException("Резюме не найдено");
        }

        List<ResumeImage> images = resumeImageRepository.findAllByResume_ResumeId(resumeId);

        return images.stream()
                .map(image -> {
                    try {
                        String key = extractKeyFromUrl(image.getUrl());
                        String signedUrl = presignedUrlService.generatePresignedUrl(key, 3600);

                        return new ResumeImageDto(image.getResumeImageId(), signedUrl);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .toList();
    }

    public ResponseEntity<ReturnStatusDeleteDto> delResumeImageContent(Long resumeImageId, String token) throws IOException {
        String username = jwtUtil.extractUsername(token);
        User user = userRepository.findByLogin(username)
                .orElseThrow(() -> new ResourceNotFoundException("Error!"));
        ResumeImage resumeImage = resumeImageRepository.findById(resumeImageId)
                .orElseThrow(() -> new ResourceNotFoundException("Из-ние не найдено"));
        if (!user.getUser_id().equals(resumeImage.getResume().getUser().getUser_id())) {
            throw new RuntimeException("Нет прав!");
        }
        ReturnStatusDeleteDto returnStatusDeleteDto = new ReturnStatusDeleteDto();
        returnStatusDeleteDto.setStatus("Удалено!");
        resumeImageRepository.delete(resumeImage);
        return ResponseEntity.ok(returnStatusDeleteDto);
    }
}
