package net.javaguides.springboot.service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.net.URL;
import java.time.Duration;

@Service
public class PresignedUrlService {

    @Value("${yandex.s3.access-key}")
    private String access;

    @Value("${yandex.s3.secret-key}")
    private String secret;

    private S3Presigner presigner;

    @PostConstruct
    public void init() {
        presigner = S3Presigner.builder()
                .endpointOverride(java.net.URI.create("https://storage.yandexcloud.net"))
                .region(Region.of("ru-central1"))
                .credentialsProvider(
                        StaticCredentialsProvider.create(AwsBasicCredentials.create(access, secret))
                )
                .build();
    }

    public String generatePresignedUrl(String key, long durationSeconds) {
        String bucket = "spring-bot";
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(10800))
                .getObjectRequest(getObjectRequest)
                .build();

        return presigner.presignGetObject(presignRequest).url().toString();
    }

    @PreDestroy
    public void close() {
        presigner.close();
    }
}
