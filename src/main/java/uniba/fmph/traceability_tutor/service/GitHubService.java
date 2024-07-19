package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.Setter;
import org.kohsuke.github.GHCommit;
import org.kohsuke.github.GitHub;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import uniba.fmph.traceability_tutor.config.security.SecretsManager;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.mapper.ItemMapper;
import uniba.fmph.traceability_tutor.model.*;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.util.AppException;
import uniba.fmph.traceability_tutor.util.NotFoundException;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;

@Service
@SecurityRequirement(name = BEARER_SECURITY_SCHEME)
public class GitHubService {
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    @Setter
    private GitHub gitHub;
    private Project currentProject;
    private final ProjectRepository projectRepository;
    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;
    private final RelationshipService relationshipService;
    private final RelationshipRepository relationshipRepository;
    private final UserService userService;
    private final SecretsManager secretsManager;

    public GitHubService(@Qualifier("github") WebClient webClient, ObjectMapper objectMapper,
                         ProjectRepository projectRepository, ItemRepository itemRepository,
                         ItemMapper itemMapper, RelationshipService relationshipService,
                         RelationshipRepository relationshipRepository, UserService userService,
                         SecretsManager secretsManager) {
        this.webClient = webClient;
        this.objectMapper = objectMapper;
        this.projectRepository = projectRepository;
        this.itemRepository = itemRepository;
        this.itemMapper = itemMapper;
        this.relationshipService = relationshipService;
        this.relationshipRepository = relationshipRepository;
        this.userService = userService;
        this.secretsManager = secretsManager;
    }

    public void setCurrentProject(Long currentProjectId) {
        this.currentProject = projectRepository.findById(currentProjectId)
                .orElseThrow(() -> new NotFoundException("Project with id " + currentProjectId + " was not found."));
        this.gitHub = getGitHubWithAuth(currentProjectId);
    }

    private GitHub getGitHubWithAuth(Long projectId) {
        try {
            User user = userService.getCurrentUser();
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new NotFoundException("Project with id " + projectId + " was not found."));
            String secret = secretsManager.retrieveSecret(user, project, UserSecretType.GITHUB_ACCESS_TOKEN);
            return GitHub.connectUsingOAuth(secret);
        } catch (Exception e) {
            throw new AppException("Failed to authenticate with GitHub: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    public String getUserLogin() throws IOException {
        return gitHub.getMyself().getLogin();
    }

    public long getUserId() throws IOException {
        return gitHub.getMyself().getId();
    }

    @Transactional
    public GetCodeItemsResponse getGetCodeItemsResponse() throws IOException {
        var projectId = currentProject.getId();
        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project with id " + projectId + " was not found."));

        project.setLastCodeFetched(OffsetDateTime.now());
        projectRepository.save(project);

        Map<Long, Item> existingCodeItems = itemRepository.findByItemTypeAndProjectOrderByIdAsc(ItemType.CODE, project)
                .stream()
                .collect(Collectors.toMap(Item::getId, Function.identity()));

        clearFromCodeData(project, existingCodeItems);

        String gitHubUsername = gitHub.getMyself().getLogin();
        String repoName = project.getRepoName();
        String query = String.format("tt[ user:%s repo:%s", gitHubUsername, repoName);
        List<GHCommit> commitObjects = gitHub.searchCommits()
                .repo(repoName)
                .user(gitHubUsername)
                .q(query).list().toList();

        Map<Long, List<Commit>> requirementToCommits = processCommits(commitObjects);

        List<Item> updatedItems = new ArrayList<>();
        List<RelationshipDTO> relationshipDTOs = new ArrayList<>();

        for (Map.Entry<Long, List<Commit>> entry : requirementToCommits.entrySet()) {
            Long requirementId = entry.getKey();
            List<Commit> commits = entry.getValue();

            Item codeItem = createOrUpdateCodeItem(project, requirementId, commits, existingCodeItems);
            updatedItems.add(codeItem);

            if (itemRepository.existsById(requirementId)) {
                RelationshipDTO dto = relationshipService.connectRequirementToCode(requirementId, codeItem.getId());
                relationshipDTOs.add(dto);
            } else {
                throw new AppException("Commit was mapped with requirement id = " + requirementId + " that is not present in database", HttpStatus.BAD_REQUEST);
            }
        }

        return new GetCodeItemsResponse(updatedItems.stream().map(itemMapper::toDto).toList(), relationshipDTOs);
    }

    @Transactional
    public void clearFromCodeData(Project project, Map<Long, Item> existingCodeItems) {
        itemRepository.deleteByItemTypeAndProjectAndRelease(ItemType.CODE, project, null);
        relationshipService.deleteAllConnectedWithCodeItems(existingCodeItems.keySet());
    }

    private Map<Long, List<Commit>> processCommits(List<GHCommit> commitObjects) throws IOException {
        Map<Long, List<Commit>> requirementToCommits = new HashMap<>();
        for (GHCommit commitObject : commitObjects) {
            var info = commitObject.getCommitShortInfo();
            Commit commit = new Commit(commitObject.getSHA1(),
                    info.getAuthor().getName(),
                    info.getMessage(),
                    info.getCommitDate(),
                    commitObject.getHtmlUrl().toString());

            List<Long> requirements = extractRequirementIds(info.getMessage());
            for (Long req : requirements) {
                requirementToCommits.computeIfAbsent(req, _ -> new ArrayList<>()).add(commit);
            }
        }
        return requirementToCommits;
    }

    private Item createOrUpdateCodeItem(Project project, Long requirementId, List<Commit> commits, Map<Long, Item> existingCodeItems) throws IOException {
        Item codeItem = existingCodeItems.getOrDefault(requirementId, new Item());
        codeItem.setProject(project);
        codeItem.setItemType(ItemType.CODE);
        codeItem.setInternalProjectUUID(UUID.randomUUID().toString());
        Map<String, String> data = new HashMap<>(codeItem.getData() != null ? codeItem.getData() : new HashMap<>());
        data.put("requirementId", requirementId.toString());
        data.put("commits", objectMapper.writeValueAsString(commits));
        data.put("description", "Commits linked to requirement #" + requirementId);
        data.put("name", commits.stream().map(Commit::message).collect(Collectors.joining("\n")));
        List<String> linksToCommits = commits.stream().map(Commit::htmlUrl).toList();
        data.put("links", objectMapper.writeValueAsString(linksToCommits));
        codeItem.setData(data);
        return itemRepository.save(codeItem);
    }

    private List<Long> extractRequirementIds(String message) {
        List<Long> ids = new ArrayList<>();
        Pattern pattern = Pattern.compile("tt\\[(.*?)]");
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            String[] idArray = matcher.group(1).split("\\s+");
            ids.addAll(Arrays.stream(idArray).map(Long::parseLong).toList());
        }
        return ids;
    }
}
