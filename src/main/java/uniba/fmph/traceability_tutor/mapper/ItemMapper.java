package uniba.fmph.traceability_tutor.mapper;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import uniba.fmph.traceability_tutor.domain.InternalIdGenerator;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.model.CreateItemDTO;
import uniba.fmph.traceability_tutor.model.ItemDTO;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;

@Mapper(componentModel = "spring", uses = InternalIdGenerator.class)
public interface ItemMapper {
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "iterationId", source = "iteration.id")
    @Mapping(target = "internalId", source = "internalId")
    ItemDTO toDto(Item item);

    @Mapping(target = "internalId", expression = "java(internalIdGenerator.generateNextInternalId())")
    @Mapping(target = "project", ignore = true)
    Item toEntity(CreateItemDTO dto, @Context InternalIdGenerator internalIdGenerator, @Context ProjectRepository projectRepository);

    @AfterMapping
    default void setProject(@MappingTarget Item item, CreateItemDTO dto, @Context ProjectRepository projectRepository) {
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new NotFoundException("Project with id " + dto.getProjectId() + " was not found when creating the new item."));
            item.setProject(project);
        }
    }

    default Item toEntity(CreateItemDTO dto) {
        return toEntity(dto, null, null);
    }
}