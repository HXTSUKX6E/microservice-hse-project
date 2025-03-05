
package net.javaguides.springboot.controller;

import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
// base URL
@RequestMapping("/api/")
public class UserController {

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