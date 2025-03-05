package net.javaguides.springboot.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employee_id;

    @NotNull
    @Column(nullable = false, unique = true)
    private String login;

    private String pendingLogin;

    @NotNull
    @Column(nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(nullable = false)

    private boolean enabled = false; // from email

    private Long company_id;

    public Employee() {}

    public Employee(String login, String password, Role role) {
        this.login = login;
        this.password = password;
        this.role = role;
    }
}
