package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import uniba.fmph.traceability_tutor.domain.User;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
