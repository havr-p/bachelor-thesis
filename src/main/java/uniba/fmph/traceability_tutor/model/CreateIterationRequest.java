package uniba.fmph.traceability_tutor.model;

import java.util.List;

public record CreateIterationRequest(Long projectId, List<Long> itemIds, List<Long> relationshipIds) {
}
