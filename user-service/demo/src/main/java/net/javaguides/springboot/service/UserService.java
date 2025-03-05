package net.javaguides.springboot.service;

import net.javaguides.springboot.model.Role;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.repository.RoleRepository;
import net.javaguides.springboot.repository.UserRepository;
import net.javaguides.springboot.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil; // Добавьте JwtUtil

    // Конструктор для инъекции зависимостей
    @Autowired
    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       RoleRepository roleRepository,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
    }

    public void checkLoginUnique(String login) {
        // Проверяем, существует ли логин в таблице пользователей
        if (userRepository.existsByLogin(login)) {
            throw new IllegalArgumentException("Данная почта уже используется!");
        }
    }

    public String registerUser(String login, String password, Role role) {

        checkLoginUnique(login); // проверка уникальности
        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(login, hashedPassword, role);
        user.setEnabled(false);
        Optional<Role> optionalRole = roleRepository.findById(2L);
        if (optionalRole.isPresent()) { user.setRole(optionalRole.get());
        } else { throw new RuntimeException("Роль не найдена!");}
        userRepository.save(user);

        return jwtUtil.generateToken(user.getLogin(), user.getRole().getRole_id());
    }

    public String authenticateUser(String login, String password) {
        User user = userRepository.findByLogin(login)
               .orElseThrow(() -> new RuntimeException("Неверный логин или пароль!"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Неверный логин или пароль!");
        }

        if (!user.isEnabled()) {
            throw new DisabledException("Аккаунт не подтвержден. Проверьте почту.");
        }

        return jwtUtil.generateToken(user.getLogin(), user.getRole().getRole_id());
    }
}