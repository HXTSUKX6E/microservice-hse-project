package net.javaguides.springboot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class CloudStorageService {

    @Value("${cloud.storage.bucket-name}")
    private String bucketName;

    @Value("${cloud.storage.folder}")
    private String folder;

    public String uploadAchievementImage(MultipartFile file, Long resumeId) {
        try {
            // Генерируем уникальное имя файла
            String fileName = "achievement_" + resumeId + "_" + UUID.randomUUID() +
                    getFileExtension(file.getOriginalFilename());

            // Здесь будет реализация загрузки в облако
            // Пример для AWS S3:
            /*
            s3Client.putObject(
                PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(folder + "/" + fileName)
                    .build(),
                RequestBody.fromInputStream(file.getInputStream(), file.getSize())
            );
            */

            return "https://storage.example.com/" + folder + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    private String getFileExtension(String fileName) {
        return fileName != null ? fileName.substring(fileName.lastIndexOf(".")) : "";
    }
}
