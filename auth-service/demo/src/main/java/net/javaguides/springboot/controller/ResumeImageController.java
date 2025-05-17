package net.javaguides.springboot.controller;

import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.ResumeImageDto;
import net.javaguides.springboot.dto.ReturnStatusDeleteDto;
import net.javaguides.springboot.model.ResumeImage;
import net.javaguides.springboot.service.ResumeImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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

//    @GetMapping("/{resumeId}/image")
//    public ResponseEntity<ResumeImageDto> getResumeImage(@PathVariable Long resumeId) {
//        ResumeImageDto imageDto = resumeImageService.getResumeImage(resumeId);
//        return ResponseEntity.ok(imageDto);
//    }

    @GetMapping("/resume-image/{resumeId}/content")
    public ResponseEntity<byte[]> getResumeImageContent(@PathVariable Long resumeId) {
        byte[] imageBytes = resumeImageService.getImageContentByResumeId(resumeId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Или динамически определяй
        headers.setCacheControl(CacheControl.noCache().getHeaderValue());

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/{resumeId}/images/content")
    public List<ResumeImageDto> getAllResumeImageContents(@PathVariable Long resumeId) {
        return resumeImageService.getAllImagePresignedUrlsByResumeId(resumeId);
    }

    @Transactional
    @DeleteMapping("/resume-image/{resumeImageId}/content")
    public ResponseEntity<ReturnStatusDeleteDto> delResumeImageContent(@PathVariable Long resumeImageId, @RequestHeader("Authorization") String authorizationHeader) throws IOException {
        String token = authorizationHeader.replace("Bearer ", "").trim();
        return resumeImageService.delResumeImageContent(resumeImageId, token);
    }
}
