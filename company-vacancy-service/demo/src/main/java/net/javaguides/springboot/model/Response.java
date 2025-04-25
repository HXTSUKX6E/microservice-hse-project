package net.javaguides.springboot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Getter
@Setter
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long response_id;

    // текущая дата
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date date;

    @JsonIgnore // Игнорируется при десериализации JSON
    @NotNull
    private String userName;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "vacancy_id", nullable = false)
    @NotNull
    private Vacancy vacancy;

    @JsonIgnore // Игнорируется при десериализации JSON
    private boolean isViewed = false;

    public Response() {}
}
