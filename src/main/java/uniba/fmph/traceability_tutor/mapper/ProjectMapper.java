package uniba.fmph.traceability_tutor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uniba.fmph.traceability_tutor.domain.Level;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.model.CreateProjectDTO;
import uniba.fmph.traceability_tutor.model.LevelDTO;
import uniba.fmph.traceability_tutor.model.ProjectDTO;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    @Mapping(target = "owner", source = "owner.id")
    ProjectDTO toDto(Project project);

    @Mapping(target = "owner.id", source = "owner")
    Project toEntity(ProjectDTO projectDTO);

    @Mapping(target = "owner", ignore = true)
    void updateProjectFromDto(ProjectDTO projectDTO, @MappingTarget Project project);

    @Mapping(target = "levels", ignore = true)
    Project toEntity(CreateProjectDTO createProjectDTO);

    Level toLevel(LevelDTO levelDTO);

    LevelDTO toLevelDTO(Level level);
}
