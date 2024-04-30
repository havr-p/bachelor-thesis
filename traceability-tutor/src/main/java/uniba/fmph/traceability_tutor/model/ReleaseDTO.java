package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ReleaseDTO {

    private Long id;

    @NotNull
    @Size(max = 255)
    private String releaseCommitId;

    @NotNull
    @Size(max = 255)
    private String semanticId;

    @NotNull
    private Long project;

}
