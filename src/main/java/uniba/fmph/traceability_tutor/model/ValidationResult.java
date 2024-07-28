package uniba.fmph.traceability_tutor.model;

import org.springframework.lang.NonNull;

public record ValidationResult(@NonNull boolean isValid, String[] messages) {
}
