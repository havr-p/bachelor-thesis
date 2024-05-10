//package uniba.fmph.traceability_tutor.controller;
//
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.context.annotation.Bean;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
//import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
//import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
//import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.reactive.function.BodyInserters;
//import org.springframework.web.reactive.function.client.WebClient;
//import uniba.fmph.traceability_tutor.model.CredentialsDTO;
//import uniba.fmph.traceability_tutor.model.SignUpDTO;
//import uniba.fmph.traceability_tutor.model.UserDTO;
//import uniba.fmph.traceability_tutor.service.UserService;
//
//import java.net.URI;
//import java.util.Map;
//
//@RestController
//@RequiredArgsConstructor
//public class AuthController {
//    private final UserService userService;
//    private final UserAuthenticationProvider userAuthenticationProvider;
//
//
//    @PostMapping("/api/login")
//    public ResponseEntity<UserDTO> login(@RequestBody CredentialsDTO credentials) {
//        UserDTO userDTO = userService.login(credentials);
//        userDTO.setToken(userAuthenticationProvider.createToken(userDTO));
//        return ResponseEntity.ok(userDTO);
//    }
//
//    @PostMapping("/api/register")
//    public ResponseEntity<UserDTO> register(@RequestBody @Valid SignUpDTO user) {
//        UserDTO createdUser = userService.register(user);
//        createdUser.setToken(userAuthenticationProvider.createToken(createdUser));
//        return ResponseEntity.created(URI.create("/api/users/" + createdUser.getId())).body(createdUser);
//    }
//
//    @GetMapping("api/renewToken/{id}")
//    public ResponseEntity<String> renewToken(@PathVariable Long id) {
//        String token = this.userAuthenticationProvider.createToken(this.userService.findById(id));
//        return ResponseEntity.ok(token);
//    }
//
//    @Bean
//    @Qualifier("github")
//    WebClient webClient(ClientRegistrationRepository clientRegistrations,
//                        OAuth2AuthorizedClientRepository authorizedClients) {
//        var oauth = new ServletOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrations, authorizedClients);
//        oauth.setDefaultClientRegistrationId(CommonOAuth2Provider.GITHUB.name().toLowerCase());
//        return WebClient.builder()
//                .apply(oauth.oauth2Configuration())
//                .build();
//    }
//
//    @GetMapping("/api/github-callback")
//    public ResponseEntity<String> handleGithubCallback(@RequestParam("code") String code,
//                                                       @RequestParam("state") String state) {
//        String clientId = "<YOUR_CLIENT_ID>";
//        String clientSecret = "<YOUR_CLIENT_SECRET>";
//
//        String tokenEndpoint = "https://github.com/login/oauth/access_token";
//
//        // Build the request payload
//        Map<String, String> requestBody = Map.of(
//                "client_id", clientId,
//                "client_secret", clientSecret,
//                "code", code,
//                "state", state
//        );
//
//        // Exchange code for an access token
//        WebClient webClient = WebClient.create();
//        String accessToken = webClient.post()
//                .uri(tokenEndpoint)
//                .contentType(MediaType.APPLICATION_JSON)
//                .body(BodyInserters.fromValue(requestBody))
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();
//
//        // Optionally process the token (store securely) or extract the access token value from the response string
//
//        // Redirect user to a welcome page or greeting page after authorization
//        return ResponseEntity.ok("Authorization successful! Your GitHub token is " + accessToken);
//    }
//
//
//}
