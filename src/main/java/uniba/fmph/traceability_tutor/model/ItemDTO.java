package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.UUID;

import java.util.Map;


@Getter
@Setter
public class ItemDTO {

    @NotNull
    private Long id;

    @NotBlank
    private Long projectId;

    @NotBlank
    @UUID
    String internalProjectUUID;

    @NotNull
    private ItemType itemType;

    @NotNull
    private Map<String, String> data;

    @Size(max = 255)
    private String status;

    private HistoryAction historyAction;

    private Long releaseId;

}
