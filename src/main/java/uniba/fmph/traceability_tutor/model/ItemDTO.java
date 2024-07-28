package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.UUID;

import java.util.Map;


@Getter
@Setter
@ToString
public class ItemDTO {

    @NotNull
    private Long id;

    @Positive
    private Long projectId;

    @Positive
    @NotNull
    Long internalId;

    @NotNull
    private ItemType itemType;

    @NotNull
    private Map<String, String> data;

    @Size(max = 255)
    private String status;

    private HistoryAction historyAction;

    private Long iterationId;

}
