package uniba.fmph.traceability_tutor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.model.ItemDTO;

@Mapper(componentModel = "spring")
public interface ItemMapper {
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "releaseId", source = "release.id")
    ItemDTO toDto(Item item);
}
