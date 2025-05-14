package net.javaguides.springboot.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.util.Date;

@Entity
@Table(name = "resume")
@Getter
@Setter
public class Resume {

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resume_id;  // ID резюме (будет одинаково с user_id)

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", referencedColumnName = "user_id", nullable = false)
    @MapsId // Это заставляет resume_id быть равным user_id
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String education;

    @Column(nullable = false)
    private String placeEducation;

    private String skills;

    private Date birthday;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String fullName;

    private String phone;

    private String contact;

    @Column(length = 2000)
    private String description;

    // текущая дата
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date date;

    public Resume() {}
}
