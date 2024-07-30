package uniba.fmph.traceability_tutor.model;

import org.springframework.lang.NonNull;

public record ProjectFromFile(@NonNull ProjectDTO projectDTO, @NonNull ContentsDTO contents) {
}
