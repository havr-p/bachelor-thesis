package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import uniba.fmph.traceability_tutor.model.ItemType;

import java.util.Map;

@Data
public class JsonItemDTO {

    private Long id;
    private Long projectId;
    private Long internalId;
    private ItemType itemType;
    private Map<String, Object> data;
    private String status;
    private String historyAction;
    private Long iterationId;

    @JsonCreator
    public JsonItemDTO(
            @JsonProperty("id") Long id,
            @JsonProperty("projectId") Long projectId,
            @JsonProperty("internalId") Long internalId,
            @JsonProperty("itemType") @NotNull ItemType itemType,
            @JsonProperty("data") @NotNull Map<String, Object> data,
            @JsonProperty("status") @Size(max = 255) String status,
            @JsonProperty("historyAction") String historyAction,
            @JsonProperty("iterationId") Long iterationId) {
        this.id = id;
        this.projectId = projectId;
        this.internalId = internalId;
        this.itemType = itemType;
        this.data = data;
        this.status = status;
        this.historyAction = historyAction;
        this.iterationId = iterationId;
    }
}
