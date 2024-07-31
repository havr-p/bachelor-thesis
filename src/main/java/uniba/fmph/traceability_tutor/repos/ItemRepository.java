package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.transaction.annotation.Transactional;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Iteration;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.model.ItemType;

import java.util.List;
import java.util.Optional;


public interface ItemRepository extends JpaRepository<Item, Long> {

    Item findFirstByProject(Project project);

    Item findFirstByIteration(Iteration iteration);

    @Query("select i from Item i where i.project.id = ?1 and i.iteration is null order by i.dateCreated")
    List<Item> findNonIterationByProjectId(Long projectId);

    @Query("select i from Item i where i.itemType = ?1 and i.project = ?2 and i.iteration is null order by i.internalId")
    List<Item> findByItemTypeAndProjectOrderByInternalIdAsc(ItemType itemType, Project project);

    @Override
    boolean existsById(Long aLong);

    @Transactional
    @Modifying
    @Query("update Item i set i.id = ?1 where i.id = ?2")
    int updateIdById(Long id, Long id1);

    long deleteByItemTypeAndProjectAndIteration(ItemType itemType, Project project, Iteration iteration);

    @Transactional
    @Modifying
    @Query("update Item i set i.iteration = ?1 where i.id = ?2")
    int updateIterationById(@NonNull Iteration iteration, @NonNull Long id);

    @Nullable
    Item findFirstByProject_IdAndItemTypeOrderByDateCreatedDesc(@NonNull Long id, ItemType itemType);

    boolean existsByInternalId(Long internalId);

    @Transactional
    @Modifying
    @Query("update Item i set i.internalId = ?1 where i.id = ?2")
    int updateInternalIdById(Long internalId, Long id);

    @Query("select i from Item i where i.project = ?1 and i.internalId = ?2 and i.iteration is null order by i.id")
    Optional<Item> findNonIterationByProjectInternalId(Project project, Long internalId);

    @Query("select i from Item i where i.internalId = ?1 and i.project.id = ?2 and i.iteration is null")
    Optional<Item> findByInternalIdAndProject_IdAndIterationNull(Long internalId, Long id);

    long deleteByProject_IdAndIterationNull(Long id);

    long deleteByInternalId(Long internalId);
}
