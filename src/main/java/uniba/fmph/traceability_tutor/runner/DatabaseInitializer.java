package uniba.fmph.traceability_tutor.runner;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import uniba.fmph.traceability_tutor.config.security.SecurityConfig;
import uniba.fmph.traceability_tutor.config.security.oauth.OAuth2Provider;
import uniba.fmph.traceability_tutor.domain.*;
import uniba.fmph.traceability_tutor.model.*;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.service.UserService;
import uniba.fmph.traceability_tutor.util.NotFoundException;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Component
public class DatabaseInitializer implements CommandLineRunner {
    private static final String ITEMS_JSON_FILE_PATH = "static/tt-requirements.json";
    private static final String RELATIONSHIPS_JSON_FILE_PATH = "static/tt-relationships.json";
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final List<User> USERS = Arrays.asList(
            new User("admin@test.com", "admin", "admin", SecurityConfig.ADMIN, OAuth2Provider.LOCAL),
            new User("user@test.com", "user", "user", SecurityConfig.USER, OAuth2Provider.LOCAL)
    );
    private static final String TRACEABILITY_TUTOR_PROJECT_NAME = "Traceability Tutor";
    private static final String TRACEABILITY_TUTOR_PROJECT_REPO_NAME = "traceability-tutor";
    private static Project traceabilityTutorProject = Project.builder().lastOpened(OffsetDateTime.now())
            .name(TRACEABILITY_TUTOR_PROJECT_NAME)
            .repoUrl("https://github.com/havr-p/traceability-tutor.git")
            .build();
    private static final List<Level> BABOK_LEVELS = Arrays.asList(
            new Level(null, "#fcf6bd", "Business", null),
            new Level(null, "#ff99c8", "Stakeholder", null),
            new Level(null, "#d0f4de", "Solution", null),
            new Level(null, "#FFD275", "Design", null),
            new Level(null, "#a9def9", "Code", null),
            new Level(null, "#e4c1f9", "Test", null));
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final ProjectRepository projectRepository;
    private final ItemRepository itemRepository;
    private final RelationshipRepository relationshipRepository;

    private static String normalizeText(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return Character.toUpperCase(text.charAt(0)) + text.substring(1).toLowerCase();
    }

    private static List<TempCreateItemDTO> parseJsonToCreateItemDTOs() throws IOException {
        String jsonContent = readResourceFile(ITEMS_JSON_FILE_PATH);
        return objectMapper.readValue(jsonContent, new TypeReference<>() {});
    }

    private static List<TempCreateRelationshipDTO> parseJsonCreateRelationshipDTOs() throws IOException {
        String jsonContent = readResourceFile(RELATIONSHIPS_JSON_FILE_PATH);
        return objectMapper.readValue(jsonContent, new TypeReference<>() {});
    }
    @Override
    public void run(String... args) {
        if (userService.getUsers().isEmpty()) {
            USERS.forEach(user -> {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userService.saveUser(user);
            });
            Project project = createDemoProjectInDb(USERS.get(0));
            setProjectData(project);

            log.info("Database initialized");
        }
    }

    private void setProjectData(Project project) {
        List<TempCreateItemDTO> tempItemDtos;
        try {
            tempItemDtos = parseJsonToCreateItemDTOs();
            tempItemDtos.forEach(dto -> {
                    String description = dto.getData().get("description");
                    String name = dto.getData().get("name");
                    dto.getData().put("description", normalizeText(description));
                dto.getData().put("name", normalizeText(name));
                });
        } catch (IOException e) {
            e.printStackTrace();
            tempItemDtos = List.of();
        }
        var list = tempItemDtos.stream().map(dto ->  mapToEntity(project, dto)).toList();
        itemRepository.saveAllAndFlush(list);


        List<TempCreateRelationshipDTO> tempCreateRelationshipDTOS;
        try {
            tempCreateRelationshipDTOS = parseJsonCreateRelationshipDTOs();
            tempCreateRelationshipDTOS.forEach(dto -> dto.setDescription(normalizeText(dto.getDescription())));
        } catch (IOException e) {
            e.printStackTrace();
            tempCreateRelationshipDTOS = List.of();
        }

        assert itemRepository.existsByInternalId(13393);
        assert itemRepository.existsByInternalId(13406);
        assert itemRepository.existsByInternalId(13408);
        assert itemRepository.existsByInternalId(16177);

        List<Relationship> relationships = tempCreateRelationshipDTOS.stream()
                .map(dto ->
                    mapToEntity(dto, project))
                .toList();

        relationshipRepository.saveAll(relationships);
        //secretsManager.storeSecret(project.getOwner(), UserSecretType.GITHUB_ACCESS_TOKEN, githubSecret, project);
    }

    private Item mapToEntity(Project project, final TempCreateItemDTO dto) {
        Item item = new Item();

        var data = dto.getData();
        item.setItemType(dto.getItemType());
        item.setData(data);
        item.setStatus(dto.getStatus());
        item.setProject(project);
        item.setInternalId(dto.internalId);
        return item;
    }

    private Relationship mapToEntity(final CreateRelationshipDTO dto, Project project) {
        Relationship relationship = new Relationship();
        relationship.setType(dto.getType());
        relationship.setDescription(dto.getDescription());
        Long startItemId = itemRepository.findNonIterationByProjectInternalId(project, dto.getStartItem()).get().getId();
        Long endItemId = itemRepository.findNonIterationByProjectInternalId(project, dto.getEndItem()).get().getId();
        relationship.setStartItem(itemRepository.findById(startItemId).orElseThrow(() -> new NotFoundException("Start item with id = " +  startItemId + " was not found")));
        relationship.setEndItem(itemRepository.findById(endItemId).orElseThrow(() -> new NotFoundException("End item with id = " +  endItemId + " was not found")));
        return relationship;
    }

    private Project createDemoProjectInDb(User user) {
        traceabilityTutorProject = Project.builder()
                .repoUrl("https://github.com/havr-p/traceability-tutor.git")
                .name(TRACEABILITY_TUTOR_PROJECT_NAME + " # " + (projectRepository.countByOwner(user) + 1))
                .repoName(TRACEABILITY_TUTOR_PROJECT_REPO_NAME)
                .owner(user)
                .lastOpened(OffsetDateTime.now())
                .levels(new ArrayList<>(BABOK_LEVELS))
                .build();

        List<Level> levels = BABOK_LEVELS.stream()
                .map(level -> {
                    Level newLevel = new Level();
                    newLevel.setColor(level.getColor());
                    newLevel.setName(level.getName());
                    newLevel.setProject(traceabilityTutorProject);
                    return newLevel;
                })
                .toList();

        traceabilityTutorProject.setLevels(levels);

        return projectRepository.save(traceabilityTutorProject);
    }

    public Long createDemoProject(User user) {
        Project project = createDemoProjectInDb(user);
        setProjectData(project);
        return project.getId();
    }

    @Getter
    @ToString
    private static class TempCreateItemDTO extends CreateItemDTO {

        public Long internalId;

        @JsonCreator
        public TempCreateItemDTO(
                @JsonProperty("id") Long internalId,
                @JsonProperty("projectId") @NotBlank Long projectId,
                @JsonProperty("itemType") @NotNull ItemType itemType,
                @JsonProperty("data") @NotNull Map<String, String> data,
                @JsonProperty("status") @Size(max = 255) String status,
                @JsonProperty(value = "mapped", required = false) Boolean mapped) {
            super(projectId, itemType, data, status);
            this.setProjectId(traceabilityTutorProject.getId());
            this.internalId = internalId;
        }

    }

    @Getter
    @ToString
    private static class TempCreateRelationshipDTO extends CreateRelationshipDTO {

        @JsonCreator
        public TempCreateRelationshipDTO(
                @JsonProperty("id") Long id,
                @JsonProperty("relationshipType") @NotNull RelationshipType relationshipType,
                @JsonProperty("description") @Size(max = 255) String description,
                @JsonProperty("startItem") @NotNull Long startItem,
                @JsonProperty("endItem") @NotNull Long endItem) {
            super(relationshipType, description, startItem, endItem);
        }

    }

    private static String readResourceFile(String resourcePath) throws IOException {
        Resource resource = new ClassPathResource(resourcePath);
        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        }
    }
}

