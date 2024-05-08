package uniba.fmph.traceability_tutor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.model.ProjectDTO;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "owner", source = "owner.id")
    ProjectDTO toDto(Project project);

    @Mapping(target = "owner.id", source = "owner")
    Project toEntity(ProjectDTO projectDTO);

    @Mapping(target = "owner", ignore = true)
        // Owner handled manually
    void updateProjectFromDto(ProjectDTO projectDTO, @MappingTarget Project project);
}
