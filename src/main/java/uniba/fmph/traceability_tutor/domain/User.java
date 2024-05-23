package uniba.fmph.traceability_tutor.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uniba.fmph.traceability_tutor.config.security.oauth.OAuth2Provider;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;


@Entity
@Table(name = "\"User\"")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class User {

    @Id
    @Column(nullable = false, updatable = false)
    @SequenceGenerator(
            name = "primary_sequence",
            sequenceName = "primary_sequence",
            allocationSize = 1,
            initialValue = 10000
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "primary_sequence"
    )
    private Long id;

    private String username;
    private String password;
    private String name;
    @Column
    private String email;

    @Column
    private String githubLogin;
    private Long githubId;
    private String avatarUrl;


    private String role;

    @Enumerated(EnumType.STRING)
    private OAuth2Provider provider; // currently only local and GitHub
    private String providerId;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private OffsetDateTime dateCreated;

    @LastModifiedDate
    @Column(nullable = false)
    private OffsetDateTime lastUpdated;

    public User(String email, String name, String password, String role, OAuth2Provider provider) {
        this.username = email;
        this.password = password;
        this.name = name;
        this.email = email;
        this.role = role;
        this.provider = provider;
    }

}
