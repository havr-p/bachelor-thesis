package uniba.fmph.traceability_tutor.domain;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class InternalIdGenerator {
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Long generateNextInternalId() {
        Query query = entityManager.createNativeQuery("SELECT COALESCE(MAX(internal_id), 0) + 1 FROM item");
        return ((Number) query.getSingleResult()).longValue();
    }
}
