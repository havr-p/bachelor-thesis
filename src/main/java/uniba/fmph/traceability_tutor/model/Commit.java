package uniba.fmph.traceability_tutor.model;

public record Commit(String sha, String author, String message, java.util.Date committedAt, String htmlUrl) {
}
