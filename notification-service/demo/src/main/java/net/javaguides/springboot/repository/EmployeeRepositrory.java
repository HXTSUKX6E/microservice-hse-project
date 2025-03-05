package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepositrory extends JpaRepository<Employee, Long> {
    Optional<Employee> findByLogin(String login);
    boolean existsByLogin(String login);
}
