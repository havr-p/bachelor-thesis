package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Iteration;
import uniba.fmph.traceability_tutor.domain.Relationship;

import java.util.List;


public interface RelationshipRepository extends JpaRepository<Relationship, Long> {

    Relationship findFirstByStartItem(Item item);

    Relationship findFirstByEndItem(Item item);

    Relationship findFirstByIteration(Iteration iteration);

    @Query("select r from Relationship r where r.iteration is null " +
            "and r.endItem.iteration is null" +
            " and r.startItem.iteration is null" +
            " and (r.startItem.project.id = ?1" +
            " or r.endItem.project.id = ?1)" +
            " order by r.dateCreated asc")
    List<Relationship> findNonIterationByProjectId(Long projectId);

    @Query("select r from Relationship r where r.iteration = ?1 and (r.startItem.id = ?2 " +
            " or r.endItem.id = ?2)")
    List<Relationship> findAllRelatedToItemAndIteration(Long iterationId, Long itemId);

    boolean existsByStartItem_IdAndEndItem_Id(Long id, Long id1);

    long deleteByStartItem_IdAndEndItem_Id(Long id, Long id1);

    long deleteByIterationNullAndStartItem_IdOrEndItem_Id(Long id, Long id1);

    @Transactional
    @Modifying
    @Query("update Relationship r set r.iteration = ?1 where r.id = ?2")
    int updateIterationById(Iteration iteration, Long id);

    long deleteByStartItem_Project_IdAndEndItem_Project_IdAndIterationNull(Long id, Long id1);
}
