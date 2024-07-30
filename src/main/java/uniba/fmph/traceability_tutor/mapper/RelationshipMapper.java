package uniba.fmph.traceability_tutor.mapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Relationship;
import uniba.fmph.traceability_tutor.model.CreateRelationshipDTO;
import uniba.fmph.traceability_tutor.model.ItemDTO;
import uniba.fmph.traceability_tutor.model.RelationshipDTO;
import uniba.fmph.traceability_tutor.service.JsonItemDTO;
import uniba.fmph.traceability_tutor.service.JsonRelationshipDTO;

@Mapper(componentModel = "spring", uses = {RelationshipMapperQualifier.class})
public interface RelationshipMapper {

    @Mapping(target = "startItem", source = ".", qualifiedByName = "startItemToEntity")
    @Mapping(target = "endItem", source = ".", qualifiedByName = "endItemToEntity")
    @Mapping(target = "iteration", source = "iterationId", qualifiedByName = "idToIteration")
    Relationship toEntity(JsonRelationshipDTO dto);


    @Named("startItemToEntity")
    default Item mapStartItem(JsonRelationshipDTO dto) {
        return ((RelationshipMapperQualifier) Mappers.getMapper(RelationshipMapperQualifier.class))
                .internalIdToItem(dto.getStartItem(), dto.getProjectId());
    }

    @Named("endItemToEntity")
    default Item mapEndItem(JsonRelationshipDTO dto) {
        return ((RelationshipMapperQualifier) Mappers.getMapper(RelationshipMapperQualifier.class))
                .internalIdToItem(dto.getEndItem(), dto.getProjectId());
    }

    @Mapping(target = "startItem", source = "startItem.internalId")
    @Mapping(target = "endItem", source = "endItem.internalId")
    @Mapping(target = "startItemInternalId", source = "startItem.internalId")
    @Mapping(target = "endItemInternalId", source = "endItem.internalId")
    @Mapping(target = "iterationId", source = "iteration.id")
    @Mapping(target = "projectId", source = "project.id")
    RelationshipDTO toDto(Relationship entity);

    RelationshipDTO jsonRelationshipDtoToRelationshipDto(JsonRelationshipDTO jsonDTO);
    CreateRelationshipDTO jsonToDto(JsonRelationshipDTO jsonDto);

}