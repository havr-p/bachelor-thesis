package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.lang.Nullable;

import java.util.List;

public record ProjectSettings(@NotBlank String name,
                              @NotBlank String repoName,
                              @NotBlank String accessToken) {
}
