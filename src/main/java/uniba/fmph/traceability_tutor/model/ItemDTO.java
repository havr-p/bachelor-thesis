package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;


@Getter
@Setter
public class ItemDTO {

    private Long id;

    @NotNull
    private ItemType itemType;

    @NotNull
    private Map<String, String> data;

    @Size(max = 255)
    private String status;

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    private String projectInternalUid;

    private HistoryAction historyAction;

    @NotNull
    private Long project;

    private Long release;

}
