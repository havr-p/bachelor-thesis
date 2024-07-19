package uniba.fmph.traceability_tutor.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.mapper.ItemMapper;
import uniba.fmph.traceability_tutor.model.*;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.service.GitHubService;
import uniba.fmph.traceability_tutor.service.RelationshipService;
import uniba.fmph.traceability_tutor.service.UserService;
import uniba.fmph.traceability_tutor.util.NotFoundException;

import java.io.IOException;
import java.util.*;

import static java.lang.StringTemplate.STR;
import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;

@RestController
@RequestMapping(value = "/api/git", produces = MediaType.APPLICATION_JSON_VALUE)
public class GitHubResource {


    private final WebClient webClient;
    private final UserService userService;
    private final SecretsManager secretsManager;
    private final ProjectRepository projectRepository;
    private final ItemRepository itemRepository;
    private final ObjectMapper objectMapper;
    private final ItemMapper itemMapper;
    private final RelationshipService relationshipService;
    private final RelationshipRepository relationshipRepository;
    private final GitHubService gitHubService;

    public GitHubResource(@Qualifier("github") WebClient webClient, UserService userService,
                          SecretsManager secretsManager,
                          ProjectRepository projectRepository,
                          ItemRepository itemRepository,
                          ObjectMapper objectMapper,
                          ItemMapper itemMapper,
                          RelationshipService relationshipService, RelationshipRepository relationshipRepository, GitHubService gitHubService) {
        this.webClient = webClient;
        this.userService = userService;
        this.secretsManager = secretsManager;
        this.projectRepository = projectRepository;
        this.itemRepository = itemRepository;
        this.objectMapper = objectMapper;
        this.itemMapper = itemMapper;
        this.relationshipService = relationshipService;
        this.relationshipRepository = relationshipRepository;
        this.gitHubService = gitHubService;
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
    @GetMapping("/{projectId}/commits")
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

    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping("/{projectId}/tags")
    public List<JsonNode> tags(@PathVariable(name = "projectId") final Long projectId) throws IOException {
        var project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project with id " + projectId + " was not found."));
        String gitHubUsername = getLogin(projectId).block();
        String url = STR."/repos/\{gitHubUsername}/\{project.getRepoName()}/tags";
        return getWebClientWithAuth(projectId).get()
                .uri(url)
                .retrieve()
                .bodyToFlux(JsonNode.class)
                .collectList()
                .block();
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping("/{projectId}/commit/{sha}")
    public List<JsonNode> commit(@PathVariable(name = "projectId") final Long projectId, @PathVariable(name = "sha") final String sha) throws IOException {
        var project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project with id " + projectId + " was not found."));
        String gitHubUsername = getLogin(projectId).block();
        String url = STR."/repos/\{gitHubUsername}/\{project.getRepoName()}/git/commits/\{sha}";
        return getWebClientWithAuth(projectId).get()
                .uri(url)
                .retrieve()
                .bodyToFlux(JsonNode.class)
                .collectList()
                .block();
    }

    /**
     * 1. Access project repository.
     * 2. Fetch all tags. Some commits can have several tags, and several commits can have same tag.
     * 3. Each code item is identified by id. If several commits are tagged with same tag, one code item with grouped commits will be created.
     * 4. When user clicks on "Fetch code items", graph
     * 5. The state of database after this request: all code items are in database
     * @param projectId - id of project
     * @return code items that should be added to currently processing graph + updated code items that was previously in graph
     * @throws IOException
     */
    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping("/{projectId}/codeItems")
    public GetCodeItemsResponse codeItems(@PathVariable(name = "projectId") final Long projectId) throws IOException {
        gitHubService.setCurrentProject(projectId);
        return gitHubService.getGetCodeItemsResponse();
    }



}

