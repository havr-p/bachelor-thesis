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
    @NotBlank
    private Long id;

    @Size(max = 255)
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String name;
    @NotBlank
    private String username;


    @Builder.Default
    private String role = "USER";
}
