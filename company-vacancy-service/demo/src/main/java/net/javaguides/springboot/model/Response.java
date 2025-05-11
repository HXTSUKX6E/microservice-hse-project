package net.javaguides.springboot.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
    @Column(nullable = false, updatable = false)
    private String userName;

    @JsonProperty(access = Access.READ_ONLY)
    @ManyToOne
    @JoinColumn(name = "vacancy_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Vacancy vacancy;

    @JsonIgnore // Игнорируется при десериализации JSON
    private boolean isViewed = false;

    public Response() {}
}
