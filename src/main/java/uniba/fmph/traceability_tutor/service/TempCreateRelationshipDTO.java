package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.ToString;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.util.FileCopyUtils;
import uniba.fmph.traceability_tutor.model.CreateRelationshipDTO;
import uniba.fmph.traceability_tutor.model.RelationshipType;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Getter
@ToString
public class TempCreateRelationshipDTO extends CreateRelationshipDTO {

    @JsonCreator
    public TempCreateRelationshipDTO(
            @JsonProperty("id") Long id,
            @JsonProperty("relationshipType") @NotNull RelationshipType relationshipType,
            @JsonProperty("description") @Size(max = 255) String description,
            @JsonProperty("startItem") @NotNull Long startItem,
            @JsonProperty("endItem") @NotNull Long endItem) {
        super(relationshipType, description, startItem, endItem);
    }

    static String readResourceFile(String resourcePath) throws IOException {
        Resource resource = new ClassPathResource(resourcePath);
        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        }
    }

}
