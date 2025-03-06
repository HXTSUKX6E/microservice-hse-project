package net.javaguides.springboot.controller;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import net.javaguides.springboot.dto.UserGetOneDTO;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.service.UserService;
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
@RequestMapping("/api/")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // register user
    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> createUser(@Valid @RequestBody User user) throws ExecutionException, InterruptedException {
        return userService.createUser(user).get();
    }

    // confirm account
    @GetMapping("/auth/confirm")
    public ResponseEntity<Map<String, Object>> confirmEmailUser(@RequestParam String token) throws ExecutionException, InterruptedException {
        return userService.confirmEmailUser(token).get();
    }

    // login and authenticate
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody @Valid Map<String, String> loginRequest) throws ExecutionException, InterruptedException {
        return userService.login(loginRequest).get();
    }

    // confirm change email
    @GetMapping("/auth/confirm-email-change")
    public ResponseEntity<Map<String, Object>> confirmEmailChange(HttpServletRequest request, @RequestParam String token) throws ExecutionException, InterruptedException {
        return userService.confirmEmailChange(request, token).get();
    }

    // change in your profile (not @Valid else drop)
    @PutMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> updateOwnProfile(HttpServletRequest request, @PathVariable Long id, @RequestBody @Valid UserGetOneDTO userGetOneDTO) throws ExecutionException, InterruptedException {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.updateOwnProfile(request, id, userGetOneDTO, currentUsername).get();
    }

    @PutMapping("/profile/change-login/{id}")
    public ResponseEntity<Map<String, Object>> updateLogin(HttpServletRequest request, @PathVariable Long id, @RequestBody @Valid Map<String, String> loginRequest) throws ExecutionException, InterruptedException {
        return userService.updateLogin(request, id, loginRequest).get();
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>>logout(HttpServletRequest request, HttpServletResponse response) throws ExecutionException, InterruptedException {
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