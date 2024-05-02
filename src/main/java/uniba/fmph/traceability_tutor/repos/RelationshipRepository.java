package uniba.fmph.traceability_tutor.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.domain.Release;


public interface RelationshipRepository extends JpaRepository<Relationship, Long> {

    Relationship findFirstByStartItem(Item item);

    Relationship findFirstByEndItem(Item item);

    Relationship findFirstByRelease(Release release);

}
