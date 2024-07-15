package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.domain.UserSecret;
import uniba.fmph.traceability_tutor.model.UserSecretType;

import java.util.Optional;

public interface UserSecretRepository extends JpaRepository<UserSecret, Long> {
    Optional<UserSecret> findByUserAndProjectAndSecretType(User user, Project project, UserSecretType secretType);

    @Transactional
    @Modifying
    @Query("update UserSecret u set u.secretValue = ?1 where u.project = ?2 and u.user = ?3 and u.secretType = ?4")
    int updateSecretValueByProjectAndUserAndSecretType(String secretValue, Project project, User user, UserSecretType type);

    Optional<UserSecret> findByProjectAndUserAndSecretType(Project project, User user, UserSecretType secretType);
}
