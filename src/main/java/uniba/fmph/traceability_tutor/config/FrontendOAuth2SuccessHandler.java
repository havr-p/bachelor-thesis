package uniba.fmph.traceability_tutor.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.kohsuke.github.GitHub;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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
    private final OAuth2AuthorizedClientProvider oauth2AuthorizedClientProvider;
    private final UserRepository userRepository;

    public FrontendOAuth2SuccessHandler(GitHubService gitHubService, OAuth2AuthorizedClientProvider oauth2AuthorizedClientProvider, UserRepository userRepository) {
        this.gitHubService = gitHubService;
        this.oauth2AuthorizedClientProvider = oauth2AuthorizedClientProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            var client = oauth2AuthorizedClientProvider.getClient();
            String success = "false";
            String gitHubLogin = "", gitHubId = "";
            String appId = "";
            if (client != null) {
                String accessToken = oauth2AuthorizedClientProvider.getAccessToken();
                gitHubService.setGitHub(GitHub.connectUsingOAuth(accessToken));
                gitHubLogin = gitHubService.getUserLogin();
                gitHubId = String.valueOf(gitHubService.getUserId());
                Optional<User> existingUser = userRepository.findByGithubId(gitHubId);
                if (existingUser.isEmpty()) {
                        User user = User.builder()
                                .githubId(gitHubId)
                                .githubAccessToken(accessToken) //do we really need it?
                                .githubLogin(gitHubLogin)
                                .build();
                        userRepository.save(user);
                    appId = String.valueOf(user.getId());
                } else {
                    User user = existingUser.get();
                    user.setGithubAccessToken(accessToken);
                    user.setGithubLogin(gitHubLogin);
                    userRepository.save(user);
                    appId = String.valueOf(user.getId());
                }
                success = "true";
            }

                // Redirect the user with the token
                String frontendUrl = "http://localhost:4200/auth?success=" + success
                        + "&login=" + gitHubLogin + "&id=" + appId;
                response.sendRedirect(frontendUrl);
            }
        }
    }

