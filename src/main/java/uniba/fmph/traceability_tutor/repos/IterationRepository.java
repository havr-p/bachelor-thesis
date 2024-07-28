package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Iteration;


public interface IterationRepository extends JpaRepository<Iteration, Long> {

    Iteration findFirstByProject(Project project);

}
