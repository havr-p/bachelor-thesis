package uniba.fmph.traceability_tutor.model;


import org.springframework.lang.Nullable;

import java.util.List;

public record GetCodeItemsResponse(List<ItemDTO> updatedItems,
                                   List<RelationshipDTO> newRelationships,
                                   @Nullable List<Long> unmappedInternalIds) {
}
