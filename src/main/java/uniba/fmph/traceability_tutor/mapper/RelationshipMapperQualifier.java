package uniba.fmph.traceability_tutor.mapper;

import org.mapstruct.Named;
import org.springframework.stereotype.Component;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Iteration;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.IterationRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;

@Component
public class RelationshipMapperQualifier {

    private final ItemRepository itemRepository;
    private final IterationRepository iterationRepository;

    public RelationshipMapperQualifier(ItemRepository itemRepository, IterationRepository iterationRepository) {
        this.itemRepository = itemRepository;
        this.iterationRepository = iterationRepository;
    }

    @Named("internalIdToItem")
    public Item internalIdToItem(Long internalId, Long projectId) {
        if (internalId == null || projectId == null) {
            return null;
        }
        return itemRepository.findByInternalIdAndProject_IdAndIterationNull(internalId, projectId).orElseThrow(() -> new NotFoundException("Item not found"));
    }

    @Named("idToIteration")
    public Iteration idToIteration(Long id) {
        if (id == null) {
            return null;
        }
        return iterationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Iteration not found"));
    }
}
