package net.javaguides.springboot.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.CreateResumeRequest;
import net.javaguides.springboot.dto.ReturnStatusDeleteDto;
import net.javaguides.springboot.model.Resume;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.service.AuthService;
import net.javaguides.springboot.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*")
@RestController
@Slf4j
// base URL
@RequestMapping("/api/user/")
public class ResumeController {

    private final ResumeService resumeService;

    @Autowired
    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/resume")
    public Resume createResume(@Valid @RequestBody CreateResumeRequest createResumeRequest, @RequestHeader("Authorization") String authorizationHeader) throws ExecutionException, InterruptedException, JsonProcessingException {
        String token = authorizationHeader.replace("Bearer ", "").trim();
        return resumeService.createResume(createResumeRequest, token).get();
    }

    @GetMapping("/resume/{id}")
    public Resume getResume(@PathVariable Long id) throws ExecutionException, InterruptedException {
        return resumeService.getResume(id).get();
    }

    @PutMapping("/resume/{id}")
    public Resume putResume(@Valid @RequestBody CreateResumeRequest createResumeRequest, @PathVariable Long id, @RequestParam String token) throws ExecutionException, InterruptedException {
        return resumeService.putResume(createResumeRequest, token, id).get();
    }

    @DeleteMapping("/resume/{id}")
    public ReturnStatusDeleteDto deleteResume(@PathVariable Long id, @RequestParam String token) throws ExecutionException, InterruptedException {
        return resumeService.deleteResume(id, token).get();
    }

}
