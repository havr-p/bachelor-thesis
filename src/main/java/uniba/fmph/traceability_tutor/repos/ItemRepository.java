package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Release;
import uniba.fmph.traceability_tutor.model.ItemType;

import java.util.List;


public interface ItemRepository extends JpaRepository<Item, Long> {

    Item findFirstByProject(Project project);

    Item findFirstByRelease(Release release);

    @Query("select i from Item i where i.project.id = ?1 and i.release is null order by i.dateCreated")
    List<Item> findNonReleaseByProjectId(Long projectId);

    List<Item> findByItemTypeAndProjectOrderByIdAsc(ItemType itemType, Project project);

    @Override
    boolean existsById(Long aLong);

    @Transactional
    @Modifying
    @Query("update Item i set i.id = ?1 where i.id = ?2")
    int updateIdById(Long id, Long id1);

    long deleteByItemTypeAndProjectAndRelease(ItemType itemType, Project project, Release release);
}
