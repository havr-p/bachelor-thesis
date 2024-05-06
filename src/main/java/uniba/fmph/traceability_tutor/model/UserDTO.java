package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String email;

    @NotNull
    private String password;

    private String firstName;
    private String lastName;
    private String token;

}
