package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.Setter;
import org.kohsuke.github.GHRepository;
import org.kohsuke.github.GitHub;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.repos.UserRepository;

import java.io.IOException;
import java.util.*;

@Service
public class GitHubService {

    @Bean
    @Qualifier("github")
    WebClient webClient(ClientRegistrationRepository clientRegistrations,
                        OAuth2AuthorizedClientRepository authorizedClients) {
        var oauth = new ServletOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrations, authorizedClients);
        oauth.setDefaultClientRegistrationId(CommonOAuth2Provider.GITHUB.name().toLowerCase());
        return WebClient.builder()
                .apply(oauth.oauth2Configuration())
                .build();
    }



    private final ObjectMapper objectMapper;
    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://github.com").build();

    public GitHubService(ObjectMapper objectMapper) throws IOException {
        this.objectMapper = objectMapper;
    }

    public Mono<String> fetchAccessToken(String clientID, String clientSecret, String sessionCode) {
        Map<String, String> body = new HashMap<>();
        body.put("client_id", clientID);
        body.put("client_secret", clientSecret);
        body.put("code", sessionCode);

        // Parsing the JSON response to extract the access token
        return webClient.post()
                .uri("/login/oauth/access_token")
                .headers(headers -> headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON)))
                .bodyValue(body)
                .retrieve()  // Initiates the request
                .bodyToMono(String.class)  // Converts the response body to Mono<String>
                .map(this::parseAccessToken);
    }

    private String parseAccessToken(String jsonResponse) {
        try {
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
            return jsonNode.asText("access_token");
        }  catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }




}
