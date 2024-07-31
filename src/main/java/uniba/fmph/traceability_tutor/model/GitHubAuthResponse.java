package uniba.fmph.traceability_tutor.model;

import java.util.List;

public record GitHubAuthResponse(boolean isAuthenticated, List<String> authErrors) {
}
