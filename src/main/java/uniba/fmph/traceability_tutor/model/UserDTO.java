package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import uniba.fmph.traceability_tutor.domain.Role;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    @Size(max = 255)
    @Email
    private String email;

    private String gitHubLogin;



    @Builder.Default
    private Role role = Role.ROLE_USER;

}
