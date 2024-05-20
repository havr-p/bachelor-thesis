package uniba.fmph.traceability_tutor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uniba.fmph.traceability_tutor.domain.Level;

import java.io.Serializable;

/**
 * DTO for {@link Level}
 */
@Data
@AllArgsConstructor
public class LevelDTO implements Serializable {
    private Long id;
    private String color;
    private String name;
}