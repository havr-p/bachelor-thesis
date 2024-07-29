package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.ToString;
import uniba.fmph.traceability_tutor.model.CreateItemDTO;
import uniba.fmph.traceability_tutor.model.ItemType;

import java.util.Map;

@Getter
@ToString
public class TempCreateItemDTO extends CreateItemDTO {

    public Long internalId;

    @JsonCreator
    public TempCreateItemDTO(
            @JsonProperty("id") Long internalId,
            @JsonProperty("projectId") @NotBlank Long projectId,
            @JsonProperty("itemType") @NotNull ItemType itemType,
            @JsonProperty("data") @NotNull Map<String, String> data,
            @JsonProperty("status") @Size(max = 255) String status,
            @JsonProperty(value = "mapped", required = false) Boolean mapped) {
        super(projectId, itemType, data, status);
        this.internalId = internalId;
    }

}
