package uniba.fmph.traceability_tutor.model;


import java.util.List;

public record GetCodeItemsResponse(List<ItemDTO> updatedItems, List<RelationshipDTO> newRelationships) {
}
