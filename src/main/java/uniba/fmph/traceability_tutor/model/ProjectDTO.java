package uniba.fmph.traceability_tutor.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectDTO {
    @NotNull
    private Long id;

    @NotBlank
    @URL
    @Size(max = 255)
    private String repoUrl;

    @NotNull
    @Size(max = 255)
    private String repoName;

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    private Long owner;
    @NotNull
    private List<LevelDTO> levels;
    @NotNull
    private OffsetDateTime lastOpened;
    private OffsetDateTime dateCreated;
    private OffsetDateTime lastModified;

}
