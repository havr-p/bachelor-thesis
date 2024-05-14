package uniba.fmph.traceability_tutor.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignUpRequest {


    @Schema(example = "password")
    @NotBlank
    private String password;

    @Schema(example = "John Doe")
    @NotBlank
    private String name;

    @Schema(example = "user@mail.com")
    @Email
    private String email;
}