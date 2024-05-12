package uniba.fmph.traceability_tutor.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.result.view.RedirectView;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.repos.UserRepository;
import uniba.fmph.traceability_tutor.service.GitHubService;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final String frontendUrl = "http://localhost:4200";
    private final UserRepository userRepository;
    private final GitHubService githubService;
    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String githubClientId;

    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String githubClientSecret;


    //fixme need to migrate to GitHub App in future
    //now exposuring cookie to client
    //https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/migrating-oauth-apps-to-github-apps
    @GetMapping("/login/oauth2/code/github")
    public RedirectView loginGitHubSuccess(HttpServletRequest request) {

        // Handle storing the user information and token, then redirect to a successful login page
        // For example, store user details in your database and generate a JWT token for further authentication.

//        String userEmail = "email";
//        System.out.println("userEmail: " + request);
//       // System.out.println("user email"  + userEmail);
//       // System.out.println("user: " + principal.getAttributes().toString());
//
//        String githubAccessToken = githubService.fetchAccessToken(githubClientId,
//                githubClientSecret, "session").block();


//        Optional<User> existingUser = userRepository.findByEmail(userEmail);
//        if (existingUser.isEmpty()) {
//            User user = new User();
//            user.setEmail(userEmail);
//            user.setProvider("gitHub");
//            user.setGithubAccessToken(githubAccessToken);
//            userRepository.save(user);
//        } else {
//            User userValue = existingUser.get();
//            userValue.setGithubAccessToken(githubAccessToken);
//            userRepository.save(userValue);
//        }
    return new RedirectView(frontendUrl + "/auth?success=true&github=" );

    }

    }

