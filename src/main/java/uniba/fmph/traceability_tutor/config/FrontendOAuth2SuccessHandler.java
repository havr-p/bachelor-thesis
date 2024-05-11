package uniba.fmph.traceability_tutor.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.repos.UserRepository;
import uniba.fmph.traceability_tutor.service.GitHubService;

import java.io.IOException;
import java.util.Optional;

@Component
public class FrontendOAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final GitHubService gitHubService;

    public FrontendOAuth2SuccessHandler(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // Retrieve the OAuth2AuthorizedClient
        if (authentication instanceof OAuth2AuthenticationToken) {

                String username = authentication.getName();
                // Redirect the user with the token
                String frontendUrl = "http://localhost:4200/auth?success=true?login=" ;
                response.sendRedirect(frontendUrl);
            }
        }
    }

