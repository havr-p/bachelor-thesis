package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Release;


public interface ItemRepository extends JpaRepository<Item, Long> {

    Item findFirstByProject(Project project);

    Item findFirstByRelease(Release release);

}
