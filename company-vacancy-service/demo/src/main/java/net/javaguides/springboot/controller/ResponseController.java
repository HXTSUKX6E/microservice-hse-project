package net.javaguides.springboot.controller;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.model.Response;
import net.javaguides.springboot.service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*")
@RestController
@EnableAsync
@Slf4j
@RequestMapping("/api/comp-vac/")
public class ResponseController {

    private final ResponseService responseService;

    @Autowired
    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    @PostMapping("/vacancy/{id}/response")
    public Response createResponse(@PathVariable Long id, @RequestBody @Valid Response response) throws ExecutionException, InterruptedException {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return responseService.createResponse(response, currentUsername, id).get();
    }

    @GetMapping("/responses")
    public List<Response> getAllResponsesByUser() throws ExecutionException, InterruptedException {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return responseService.getAllResponsesByUser(currentUsername).get();
    }

}
