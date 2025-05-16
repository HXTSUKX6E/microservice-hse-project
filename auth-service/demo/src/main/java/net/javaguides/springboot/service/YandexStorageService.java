package net.javaguides.springboot.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
public class YandexStorageService {

    @Value("${yandex.s3.bucket-name}")
    private String bucketName;

    @Autowired
    private S3Client s3Client;

    public String uploadFile(MultipartFile file) throws IOException {
        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
            log.info("Successfully uploaded file '{}' to bucket '{}'", key, bucketName);
        } catch (S3Exception e) {
            log.error("S3Exception: statusCode={}, requestId={}, errorCode={}, message={}",
                    e.statusCode(),
                    e.requestId(),
                    e.awsErrorDetails() != null ? e.awsErrorDetails().errorCode() : "N/A",
                    e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage()
            );
            throw e;
        }

        return "https://storage.yandexcloud.net/" + bucketName + "/" + key;
    }

    public byte[] downloadFile(String key) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(getObjectRequest);
            return objectBytes.asByteArray();
        } catch (S3Exception e) {
            log.error("Ошибка загрузки объекта из S3: {}", e.awsErrorDetails().errorMessage());
            throw e;
        }
    }
//    public String generateTemporaryUrl(String key, int expirationInSeconds) {
//        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName, key)
//                .withMethod(HttpMethod.GET)
//                .withExpiration(new Date(System.currentTimeMillis() + expirationInSeconds * 1000));
//        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
//        return url.toString();
//    }

}
