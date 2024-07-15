package uniba.fmph.traceability_tutor.rest;

import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import uniba.fmph.traceability_tutor.config.security.SecretsManager;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.model.ProjectDTO;
import uniba.fmph.traceability_tutor.model.UserSecretType;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.UserRepository;
import uniba.fmph.traceability_tutor.service.GitHubService;
import uniba.fmph.traceability_tutor.service.ProjectService;
import uniba.fmph.traceability_tutor.service.UserService;
import uniba.fmph.traceability_tutor.util.NotFoundException;

import java.io.IOException;
import java.util.List;

import static java.lang.StringTemplate.STR;
import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;

@RestController
@RequestMapping(value = "/api/git", produces = MediaType.APPLICATION_JSON_VALUE)
public class GitHubResource {


    private final WebClient webClient;
    private final UserService userService;
    private final SecretsManager secretsManager;
    private final ProjectRepository projectRepository;

    public GitHubResource(@Qualifier("github") WebClient webClient, UserService userService,
                          SecretsManager secretsManager,
                          ProjectRepository projectRepository) {
        this.webClient = webClient;
        this.userService = userService;
        this.secretsManager = secretsManager;
        this.projectRepository = projectRepository;
    }

    private WebClient getWebClientWithAuth(Long projectId) {
        User user = userService.getCurrentUser();
        var project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project with id " + projectId + " was not found."));
        String secret = secretsManager.retrieveSecret(user, project, UserSecretType.GITHUB_ACCESS_TOKEN);
        return webClient.mutate()
                .defaultHeader("Authorization", "Bearer " + secret)
                .build();
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping("/commits/{projectId}")
    public List<JsonNode> commits(@PathVariable(name = "projectId") final Long projectId) throws IOException {
        var project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project with id " + projectId + " was not found."));
        String gitHubUsername = getLogin(projectId).block();
        String url = STR."/repos/\{gitHubUsername}/\{project.getRepoName()}/commits";
        return getWebClientWithAuth(projectId).get()
                .uri(url)
                .retrieve()
                .bodyToFlux(JsonNode.class)
                .collectList()
                .block();
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping("/login")
    public Mono<String> getLogin(Long projectId) throws IOException {
        String url = "/user";
        return getWebClientWithAuth(projectId).get()
                .uri(url)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(jsonNode -> jsonNode.get("login").asText());
    }


}

