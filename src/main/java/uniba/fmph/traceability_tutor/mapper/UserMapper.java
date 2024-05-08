package uniba.fmph.traceability_tutor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.model.SignUpDTO;
import uniba.fmph.traceability_tutor.model.UserDTO;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toUserDTO(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "email", source = "email")
    @Mapping(target = "role", constant = "ROLE_USER")
    User signUpToUser(SignUpDTO signUpDto);


}
