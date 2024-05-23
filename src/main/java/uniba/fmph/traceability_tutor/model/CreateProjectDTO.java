package uniba.fmph.traceability_tutor.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
public class CreateProjectDTO {

    @NotBlank
    @URL
    @Size(max = 255)
    private String repoUrl;

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    private List<LevelDTO> levels;

    @NotBlank
    @Schema(description = "Access token for project from code hosting platform (currently only GitHub)")
    private String accessToken;


}
