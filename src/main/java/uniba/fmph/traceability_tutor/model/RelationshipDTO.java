package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class RelationshipDTO {

    private Long id;

    @NotNull
    private RelationshipType type;

    private HistoryAction historyAction;

    @Size(max = 255)
    private String description;

    @NotNull
    private Long startItem;

    @NotNull
    private Long endItem;

    private Long release;

}
