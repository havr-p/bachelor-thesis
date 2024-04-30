package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ProjectDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String repoUrl;

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    private Long owner;

}
