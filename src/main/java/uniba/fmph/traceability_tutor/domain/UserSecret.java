package uniba.fmph.traceability_tutor.domain;

import jakarta.persistence.*;
import lombok.*;
import uniba.fmph.traceability_tutor.model.UserSecretType;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserSecret {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private UserSecretType secretType;

    @Column(nullable = false)
    private String secretValue;


    @OneToOne
    @JoinTable(name = "UserSecret_project",
            joinColumns = @JoinColumn(name = "userSecret_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id"))
    private Project project;
}
