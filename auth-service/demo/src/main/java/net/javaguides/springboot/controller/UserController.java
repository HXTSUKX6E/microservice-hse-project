
package net.javaguides.springboot.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.exception.ResourceNotFoundException;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.repository.UserRepository;
import net.javaguides.springboot.service.EmailService;
import net.javaguides.springboot.service.UserService;
import net.javaguides.springboot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*")
@RestController
@Slf4j
// base URL
@RequestMapping("/api/auth/")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // register user
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody User user) throws ExecutionException, InterruptedException {
        return userService.createUser(user).get();
    }

    // confirm account
    @GetMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmEmailUser(@RequestParam String token) throws ExecutionException, InterruptedException {
        return userService.confirmEmailUser(token).get();
    }

    // login and authenticate
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody @Valid Map<String, String> loginRequest) throws ExecutionException, InterruptedException {
        return userService.login(loginRequest).get();
    }

    // confirm change email
    @GetMapping("/confirm-email-change")
    public ResponseEntity<Map<String, Object>> confirmEmailChange(@RequestParam String token) throws ExecutionException, InterruptedException {
        return userService.confirmEmailChange(token).get();
    }

    // change in your profile (not @Valid else drop)
    @PutMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> updateOwnProfile(@PathVariable Long id, @RequestBody User user) throws ExecutionException, InterruptedException {
        return userService.updateOwnProfile(id, user).get();
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>>logout(HttpServletRequest request, HttpServletResponse response) throws ExecutionException, InterruptedException {
        SecurityContextHolder.clearContext();
        return userService.logout(request,response).get();
    }


    /*
    // get information about my user
    @GetMapping("/profile/{id}")
    @Async
    public CompletableFuture<ResponseEntity<User>> getUserById(@PathVariable Long id) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователя не существует!"));

        if (!existingUser.getLogin().equals(currentUsername)) {
            throw new RuntimeException("Вы можете обновлять только информацию о своем профиле!");
        }
        return CompletableFuture.completedFuture(ResponseEntity.ok(existingUser));
    }

    // delete user rest api
    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasRole('ROLE_1')")
    @Async
    public CompletableFuture<ResponseEntity<Map<String, Object>>> deleteUser(@PathVariable Long id){
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователя не существует!"));

        if (user.getLogin().equals(currentUsername)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Вы не можете удалить свой профиль!");
            return CompletableFuture.completedFuture(ResponseEntity.status(403).body(response));
        }

        userRepository.delete(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Пользователь успешно удален!");
        return CompletableFuture.completedFuture(ResponseEntity.ok(response));
    }

    // delete profile
    @DeleteMapping("/profile/{id}")
    @Async
    public CompletableFuture<ResponseEntity<Map<String, Object>>> deleteMyProfile(@PathVariable Long id) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователя не существует!"));

        if (!existingUser.getLogin().equals(currentUsername)) {
            throw new RuntimeException("Вы можете удалить только свой профиль!");
        }
        userRepository.delete(existingUser);

        SecurityContextHolder.clearContext();

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Профиль успешно удалён!");
        return CompletableFuture.completedFuture(ResponseEntity.ok(response));
    }
     */
}