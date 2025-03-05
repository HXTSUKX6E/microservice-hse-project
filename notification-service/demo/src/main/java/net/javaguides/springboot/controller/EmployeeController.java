package net.javaguides.springboot.controller;

import jakarta.validation.Valid;
import net.javaguides.springboot.model.Employee;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.repository.EmployeeRepositrory;
import net.javaguides.springboot.service.EmailService;
import net.javaguides.springboot.service.UserService;
import net.javaguides.springboot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@CrossOrigin(origins = "*")
@RestController
// base URL
@RequestMapping("/api/")
public class EmployeeController {

    private final EmailService emailService;
    private final UserService userService;
    private final EmployeeRepositrory employeeRepositrory;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public EmployeeController(UserService userService, EmployeeRepositrory employeeRepositrory, JwtUtil jwtUtil, BCryptPasswordEncoder bCryptPasswordEncoder, EmailService emailService) {
        this.userService = userService;
        this.employeeRepositrory = employeeRepositrory;
        this.jwtUtil = jwtUtil;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.emailService = emailService;
    }

    // register
    @PostMapping("/auth/emp/register")
    @Async
    public CompletableFuture<ResponseEntity<Map<String, Object>>> createUser(@Valid @RequestBody Employee employee) {
        String token = userService.registerEmployee(employee.getLogin(), employee.getPassword(), employee.getRole());

        Map<String, Object> responseEmp = new HashMap<>();
        if (!emailService.isValidEmail(employee.getLogin())) {
            responseEmp.put("success", false);
            responseEmp.put("message", "Невалидный email!");
            return CompletableFuture.completedFuture(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseEmp));
        }
        emailService.sendVerificationEmailEmp(employee.getLogin(), token);

        responseEmp.put("created", Boolean.TRUE);
        return CompletableFuture.completedFuture(ResponseEntity.ok(responseEmp));
    }

    // confirm account
    @GetMapping("/auth/emp/confirm")
    @Async
    public CompletableFuture<ResponseEntity<Map<String, Object>>> confirmEmail(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = jwtUtil.extractUsername(token);

            Optional<Employee> employeeOptional = employeeRepositrory.findByLogin(email);
            if (employeeOptional.isPresent()) {
                Employee employee = employeeOptional.get();
                employee.setEnabled(true);
                employeeRepositrory.save(employee);

                response.put("success", true);
                response.put("message", "User confirmed successfully");
                return CompletableFuture.completedFuture(ResponseEntity.ok(response));
            } else {
                response.put("success", false);
                response.put("message", "Пользователя не существует!");
                return CompletableFuture.completedFuture(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response));
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Ошибка: " + e.getMessage());
            return CompletableFuture.completedFuture(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response));
        }
    }

    // login and authenticate
    @Async
    @PostMapping("/auth/emp/login")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> login(@RequestBody @Valid Map<String, String> loginRequest) {
        String login = loginRequest.get("login");
        String password = loginRequest.get("password");
        try {
            String token = userService.authenticateEmployee(login, password);

            Map<String, Object> response = new HashMap<>();
            response.put("authenticated", Boolean.TRUE);
            response.put("token", token);
            return CompletableFuture.completedFuture(ResponseEntity.ok(response));}
        catch (DisabledException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("authenticated", Boolean.FALSE);
            errorResponse.put("error", "Аккаунт не подтвержден! Подтвердите через электронную почту.");
            return CompletableFuture.completedFuture(ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse));
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("authenticated", Boolean.FALSE);
            errorResponse.put("error", e.getMessage());

            return CompletableFuture.completedFuture(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse));
        }
    }
}
