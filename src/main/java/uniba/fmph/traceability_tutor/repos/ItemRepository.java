package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Release;

import java.util.List;


public interface ItemRepository extends JpaRepository<Item, Long> {

    Item findFirstByProject(Project project);

    Item findFirstByRelease(Release release);

    @Query("select i from Item i where i.project.id = ?1 and i.release is null order by i.dateCreated")
    List<Item> findNonReleaseByProjectId(Long projectId);
}
