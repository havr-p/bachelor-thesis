package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import uniba.fmph.traceability_tutor.model.RelationshipType;


@Data
public class JsonRelationshipDTO {

    private Long id;
    private RelationshipType type;
    private String historyAction;
    private String description;
    private Long startItem;
    private Long endItem;
    private Long iterationId;
    private Long startItemInternalId;
    private Long endItemInternalId;
    private Long projectId;

    @JsonCreator
    public JsonRelationshipDTO(
            @JsonProperty("id") Long id,
            @JsonProperty("type") @NotNull RelationshipType type,
            @JsonProperty("historyAction") String historyAction,
            @JsonProperty("description") @Size(max = 255) String description,
            @JsonProperty("startItem") @NotNull Long startItem,
            @JsonProperty("endItem") @NotNull Long endItem,
            @JsonProperty("startItemInternalId") @NotNull Long startItemInternalId,
            @JsonProperty("endItemInternalId") @NotNull Long endItemInternalId,
            @JsonProperty("iterationId") Long iterationId,
            @JsonProperty("projectId") Long projectId) {
        this.id = id;
        this.type = type;
        this.historyAction = historyAction;
        this.description = description;
        this.startItem = startItem;
        this.endItem = endItem;
        this.iterationId = iterationId;
        this.startItemInternalId = startItemInternalId;
        this.endItemInternalId = endItemInternalId;
        this.projectId = projectId;
    }
}
