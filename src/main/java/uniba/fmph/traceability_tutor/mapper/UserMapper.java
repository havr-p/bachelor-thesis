package uniba.fmph.traceability_tutor.mapper;

import org.mapstruct.Mapper;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.model.UserDTO;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toUserDTO(User user);
}
