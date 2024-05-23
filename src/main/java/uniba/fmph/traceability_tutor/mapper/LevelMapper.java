package uniba.fmph.traceability_tutor.mapper;

import org.mapstruct.Mapper;
import uniba.fmph.traceability_tutor.domain.Level;
import uniba.fmph.traceability_tutor.model.LevelDTO;

@Mapper(componentModel = "spring")
public interface LevelMapper {
    Level toLevel(LevelDTO levelDTO);
    LevelDTO toLevelDTO(Level level);
}
