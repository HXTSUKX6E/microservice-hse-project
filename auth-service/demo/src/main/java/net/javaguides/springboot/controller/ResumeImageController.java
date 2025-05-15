package net.javaguides.springboot.controller;

import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.model.ResumeImage;
import net.javaguides.springboot.service.ResumeImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@CrossOrigin(origins = "*")
@Slf4j
// base URL
@RequestMapping("/api/user/")
public class ResumeImageController {
    private final ResumeImageService resumeImageService;

    @Autowired
    public ResumeImageController(ResumeImageService resumeImageService) {
        this.resumeImageService = resumeImageService;
    }

    @PostMapping("/{resumeId}/image")
    public ResponseEntity<ResumeImage> uploadResumeImage(
            @PathVariable Long resumeId,
            @RequestParam("file") MultipartFile file) throws IOException {
        ResumeImage savedImage = resumeImageService.uploadResumeImage(resumeId, file);
        return ResponseEntity.ok(savedImage);
    }
}
