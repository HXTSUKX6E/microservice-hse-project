package net.javaguides.springboot.service;

import jakarta.annotation.PostConstruct;
import net.javaguides.springboot.model.Role;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.repository.RoleRepository;
import net.javaguides.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostConstruct
    public void init() {
        Role role1 = new Role("Администратор");
        Role role2 = new Role("Пользователь");
        Role role3 = new Role("Сотрудник");
        if (roleRepository.count() == 0) { // Проверяем, пуста ли таблица
            roleRepository.save(role1);
            roleRepository.save(role2);
            roleRepository.save(role3);
        }
        if (userRepository.count() == 0) {
            String pass = bCryptPasswordEncoder.encode("123");

            User user1 = new User("dima20030617@mail.ru", pass, role1);
            user1.setEnabled(true);

            userRepository.save(user1);
        }
    }
}
