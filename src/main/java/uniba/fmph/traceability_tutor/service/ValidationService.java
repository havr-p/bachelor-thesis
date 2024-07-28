package uniba.fmph.traceability_tutor.service;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.model.ItemType;
import uniba.fmph.traceability_tutor.model.ValidationResult;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.IterationRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;

import java.time.OffsetDateTime;
import java.util.*;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;

@Service
@SecurityRequirement(name = BEARER_SECURITY_SCHEME)
public class ValidationService {

    private final ItemRepository itemRepository;
    private final ProjectRepository projectRepository;
    private final IterationRepository iterationRepository;
    private final RelationshipRepository relationshipRepository;
    @PersistenceContext
    private EntityManager entityManager;


    ValidationService(ItemRepository itemRepository, ProjectRepository projectRepository, IterationRepository iterationRepository, RelationshipRepository relationshipRepository) {

        this.itemRepository = itemRepository;
        this.projectRepository = projectRepository;
        this.iterationRepository = iterationRepository;
        this.relationshipRepository = relationshipRepository;
    }

    @Transactional(readOnly = true)
    public ValidationResult validateItemEdit(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        Hibernate.initialize(item.getChildRelationships());


        List<ValidationStage> stages = Arrays.asList(
                this::validateChildItemsUpdate,
                //this::validateItemStatus,
                this::validateItemType
        );

        List<String> messages = new ArrayList<>();
        boolean isValid = true;

        for (ValidationStage stage : stages) {
            ValidationResult stageResult = stage.validate(item);
            messages.addAll(Arrays.asList(stageResult.messages()));
            isValid &= stageResult.isValid();
        }

        return new ValidationResult(isValid, messages.toArray(new String[0]));
    }

    private ValidationResult validateChildItemsUpdate(Item item) {
        if (!item.getChildRelationships().isEmpty() && !accessorsWasUpdatedEarlier(item.getId())) {
            return new ValidationResult(false, new String[]{"Warning: Child items have not been updated. Consider updating them as well."});
        }
        return new ValidationResult(true, new String[0]);
    }

    private ValidationResult validateItemStatus(Item item) {
        if ("CLOSED".equals(item.getStatus()) && !item.getChildRelationships().isEmpty()) {
            return new ValidationResult(false, new String[]{"Error: Cannot close an item with open child items."});
        }
        return new ValidationResult(true, new String[0]);
    }

    private ValidationResult validateItemType(Item item) {
        if (item.getItemType() == ItemType.REQUIREMENT && item.getData().get("description") == null) {
            return new ValidationResult(false, new String[]{"Error: Requirements must have a description."});
        }
        return new ValidationResult(true, new String[0]);
    }

    private boolean accessorsWasUpdatedEarlier(Long rootItemId) {
        Item rootItem = itemRepository.findById(rootItemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        return checkChildrenUpdated(rootItem, rootItem.getLastUpdated());
    }

    @Transactional(readOnly = true)
    public boolean checkChildrenUpdated(Item rootItem, OffsetDateTime parentLastUpdated) {
        Set<Long> visitedItems = new HashSet<>();
        Queue<Item> itemsToCheck = new LinkedList<>();
        itemsToCheck.offer(rootItem);

        while (!itemsToCheck.isEmpty()) {
            Item currentItem = itemsToCheck.poll();

            if (visitedItems.contains(currentItem.getId())) {
                continue;
            }
            visitedItems.add(currentItem.getId());

            for (Relationship relationship : currentItem.getChildRelationships()) {
                Item childItem = relationship.getEndItem();

                if (childItem.getLastUpdated().isAfter(parentLastUpdated)) {
                    return true;
                }

                itemsToCheck.offer(childItem);
            }
        }

        return false;
    }

    @FunctionalInterface
    interface ValidationStage {
        ValidationResult validate(Item item);
    }
}
