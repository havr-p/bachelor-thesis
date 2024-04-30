package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Release;


public interface ReleaseRepository extends JpaRepository<Release, Long> {

    Release findFirstByProject(Project project);

}
