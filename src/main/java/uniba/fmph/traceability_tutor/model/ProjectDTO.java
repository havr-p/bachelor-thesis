package uniba.fmph.traceability_tutor.model;

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
public class ProjectDTO {

    private Long id;

    @NotBlank
    @URL
    @Size(max = 255)
    private String repoUrl;

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    private Long owner;

    private List<LevelDTO> levels;


    private OffsetDateTime lastOpened;
    private OffsetDateTime dateCreated;
    private OffsetDateTime lastModified;

}
