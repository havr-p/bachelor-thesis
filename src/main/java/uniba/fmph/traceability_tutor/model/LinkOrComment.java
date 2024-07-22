package uniba.fmph.traceability_tutor.model;

import java.time.OffsetDateTime;
import java.util.Date;

public record LinkOrComment(String linkOrComment, Date addedAt) {
}
