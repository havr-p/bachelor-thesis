package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.domain.UserSecret;
import uniba.fmph.traceability_tutor.model.UserSecretType;

import java.util.Optional;

public interface UserSecretRepository extends JpaRepository<UserSecret, Long> {
    Optional<UserSecret> findByUserAndProjectAndSecretType(User user, Project project, UserSecretType secretType);
    void deleteAllByUserAndSecretType(User user, UserSecretType secretType);
}
