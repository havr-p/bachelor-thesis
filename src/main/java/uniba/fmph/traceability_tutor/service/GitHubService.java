package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.Setter;
import org.kohsuke.github.GitHub;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;

@Service
@SecurityRequirement(name = BEARER_SECURITY_SCHEME)
public class GitHubService {
private final WebClient webClient;



    private final ObjectMapper objectMapper;
    @Setter
    private GitHub gitHub;


    public GitHubService(@Qualifier("github") WebClient webClient, ObjectMapper objectMapper) throws IOException {
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }


//    public Mono<String> fetchAccessToken(String clientID, String clientSecret, String sessionCode) {
//        Map<String, String> body = new HashMap<>();
//        body.put("client_id", clientID);
//        body.put("client_secret", clientSecret);
//        body.put("code", sessionCode);
//
//        // Parsing the JSON response to extract the access token
//        return webClient.post()
//                .uri("/login/oauth/access_token")
//                .headers(headers -> headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON)))
//                .bodyValue(body)
//                .retrieve()  // Initiates the request
//                .bodyToMono(String.class)  // Converts the response body to Mono<String>
//                .map(this::parseAccessToken);
//    }
//
//    private String parseAccessToken(String jsonResponse) {
//        try {
//            JsonNode jsonNode = objectMapper.readTree(jsonResponse);
//            return jsonNode.asText("access_token");
//        }  catch (JsonProcessingException e) {
//            e.printStackTrace();
//            throw new RuntimeException(e);
//        }
//    }


    public String getUserLogin() throws IOException {
//        return webClient.get().uri("/user/emails")
//                .retrieve()
//                .bodyToMono(String.class)
//                .block();
        return gitHub.getMyself().getLogin();
    }

    public long getUserId() throws IOException {
        return gitHub.getMyself().getId();
    }
}
