package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.User;


public interface ProjectRepository extends JpaRepository<Project, Long> {

    Project findFirstByOwner(User user);

}
