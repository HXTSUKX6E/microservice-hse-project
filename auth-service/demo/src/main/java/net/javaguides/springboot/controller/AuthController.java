package net.javaguides.springboot.controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.ResetPasswordDTO;
import net.javaguides.springboot.dto.UserGetOneDTO;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.service.AuthService;
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
@RequestMapping("/api/auth/")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // register user
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody User user) throws ExecutionException, InterruptedException, JsonProcessingException {
        return authService.createUser(user).get();
    }

    // confirm account
    @GetMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmEmailUser(@RequestParam String token) throws ExecutionException, InterruptedException {
        return authService.confirmEmailUser(token).get();
    }

    // login and authenticate
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody @Valid Map<String, String> loginRequest) throws ExecutionException, InterruptedException {
        return authService.login(loginRequest).get();
    }

    // change in your profile (not @Valid else drop)
    @PutMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> updateOwnProfile(HttpServletRequest request, @PathVariable Long id, @RequestBody @Valid UserGetOneDTO userGetOneDTO) throws ExecutionException, InterruptedException {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return authService.updateOwnProfile(request, id, userGetOneDTO, currentUsername).get();
    }

    @PutMapping("/profile/change-login/{id}")
    public ResponseEntity<Map<String, Object>> updateLogin(HttpServletRequest request, @PathVariable Long id, @RequestBody @Valid Map<String, String> loginRequest) throws ExecutionException, InterruptedException {
        return authService.updateLogin(request, id, loginRequest).get();
    }

    // confirm change email
    @GetMapping("/confirm-email-change")
    public ResponseEntity<Map<String, Object>> confirmEmailChange(HttpServletRequest request, @RequestParam String token) throws ExecutionException, InterruptedException {
        return authService.confirmEmailChange(token).get();
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>>logout(HttpServletRequest request, HttpServletResponse response) throws ExecutionException, InterruptedException {
        return authService.logout(request, response).get();
    }

    // password recovery
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> requestPasswordReset(@RequestBody Map<String, String> loginRequest) throws ExecutionException, InterruptedException {
        return authService.forgotPassword(loginRequest).get();
    }

    @PostMapping("/confirm-reset-password")
    public ResponseEntity<Map<String, Object>> confirmPasswordReset(@RequestParam String token, @RequestBody @Valid ResetPasswordDTO resetPasswordDTO) throws ExecutionException, InterruptedException {
        return authService.resetPassword(token, resetPasswordDTO).get();
    }

//    @GetMapping("/profile/{id}")
//    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable Long id) throws ExecutionException, InterruptedException {
//        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
//        return authService.getInfoAboutUser(id, currentUsername).get();
//    }
}