package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CreateRelationshipDTO {
    @NotNull
    private RelationshipType type;

    @Size(max = 255)
    private String description;

    @NotNull
    private Long startItem;

    @NotNull
    private Long endItem;
}
