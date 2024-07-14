package uniba.fmph.traceability_tutor.model;

import jakarta.validation.constraints.NotBlank;

public record ProjectSettings(@NotBlank String name, @NotBlank String repoName, @NotBlank String url) {
}
