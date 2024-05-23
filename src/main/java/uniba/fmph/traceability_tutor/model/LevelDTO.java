package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import uniba.fmph.traceability_tutor.domain.Level;

import java.io.Serializable;

/**
 * DTO for {@link Level}
 */
@Data
@AllArgsConstructor
public class LevelDTO {
    @NotBlank
    private String color;
    @NotBlank
    private String name;
}