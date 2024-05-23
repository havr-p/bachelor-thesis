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
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uniba.fmph.traceability_tutor.config.security.SecurityConfig;
import uniba.fmph.traceability_tutor.config.security.oauth.OAuth2Provider;
import uniba.fmph.traceability_tutor.domain.*;
import uniba.fmph.traceability_tutor.model.CreateItemDTO;
import uniba.fmph.traceability_tutor.model.CreateRelationshipDTO;
import uniba.fmph.traceability_tutor.model.ItemType;
import uniba.fmph.traceability_tutor.model.RelationshipType;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.RelationshipRepository;
import uniba.fmph.traceability_tutor.service.UserService;
import uniba.fmph.traceability_tutor.util.NotFoundException;

import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Component
public class DatabaseInitializer implements CommandLineRunner {
    private static final String ITEMS_JSON_FILE_PATH = "src/main/resources/static/tt-requirements.json";
    private static final String RELATIONSHIPS_JSON_FILE_PATH = "src/main/resources/static/tt-relationships.json";
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final List<User> USERS = Arrays.asList(
            new User("admin@test.com", "admin", "admin", SecurityConfig.ADMIN, OAuth2Provider.LOCAL),
            new User("user@test.com", "user", "user", SecurityConfig.USER, OAuth2Provider.LOCAL)
    );
    private static final Project TRACEABILITY_TUTOR_PROJECT = Project.builder().lastOpened(OffsetDateTime.now())
            .name("Traceability Tutor")
            .repoUrl("https://github.com/havr-p/traceability-tutor.git")
            .build();
    private static final List<Level> BABOK_LEVELS = Arrays.asList(
            new Level(null, "#fcf6bd", "Business", TRACEABILITY_TUTOR_PROJECT),
            new Level(null, "#ff99c8", "Stakeholder", TRACEABILITY_TUTOR_PROJECT),
            new Level(null, "#d0f4de", "Solution", TRACEABILITY_TUTOR_PROJECT),
            new Level(null, "#FFD275", "Design", TRACEABILITY_TUTOR_PROJECT),
            new Level(null, "#a9def9", "Code", TRACEABILITY_TUTOR_PROJECT),
            new Level(null, "#e4c1f9", "Test", TRACEABILITY_TUTOR_PROJECT));
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final ProjectRepository projectRepository;
    private final ItemRepository itemRepository;
    private final RelationshipRepository relationshipRepository;

    private static List<TempCreateItemDTO> parseJsonToCreateItemDTOs() throws IOException {
        return objectMapper.readValue(new File(DatabaseInitializer.ITEMS_JSON_FILE_PATH), new TypeReference<>() {
        });
    }

    private static List<TempCreateRelationshipDTO> parseJsonCreateRelationshipDTOs() throws IOException {
        return objectMapper.readValue(new File(DatabaseInitializer.RELATIONSHIPS_JSON_FILE_PATH), new TypeReference<>() {
        });
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
        } catch (IOException e) {
            e.printStackTrace();
            tempItemDtos = List.of();
        }

        Map<Long, Long> oldToNewIdMap = new HashMap<>();

        for (TempCreateItemDTO dto : tempItemDtos) {
            Item item = mapToEntity(project, dto);
            item.setId(dto.getId());
            Item savedItem = itemRepository.saveAndFlush(item);

            oldToNewIdMap.put(dto.getId(), savedItem.getId());
        }

        List<TempCreateRelationshipDTO> tempCreateRelationshipDTOS;
        try {
            tempCreateRelationshipDTOS = parseJsonCreateRelationshipDTOs();
        } catch (IOException e) {
            e.printStackTrace();
            tempCreateRelationshipDTOS = List.of();
        }

        List<Relationship> relationships = tempCreateRelationshipDTOS.stream()
                .map(dto -> {
                    Relationship relationship = mapToEntity(dto, oldToNewIdMap);
                    relationship.setId(dto.getId());
                    return relationship;
                })
                .toList();

        relationshipRepository.saveAll(relationships);
    }

    private Item mapToEntity(Project project, final CreateItemDTO createItemDTO) {
        Item item = new Item();

        var data = createItemDTO.getData();
        item.setItemType(createItemDTO.getItemType());
        item.setData(data);
        item.setStatus(createItemDTO.getStatus());
        item.setInternalProjectUUID(UUID.randomUUID().toString());

        item.setProject(project);
        return item;
    }

    private Relationship mapToEntity(final CreateRelationshipDTO dto, Map<Long, Long> oldToNewIdMap) {
        Relationship relationship = new Relationship();
        relationship.setType(dto.getType());
        relationship.setDescription(dto.getDescription());
        relationship.setStartItem(itemRepository.findById(oldToNewIdMap.get(dto.getStartItem())).orElseThrow(() -> new NotFoundException("Item not found")));
        relationship.setEndItem(itemRepository.findById(oldToNewIdMap.get(dto.getEndItem())).orElseThrow(() -> new NotFoundException("Item not found")));
        return relationship;
    }

    private Project createDemoProjectInDb(User user) {
        TRACEABILITY_TUTOR_PROJECT.setLevels(BABOK_LEVELS);
        String projectName =  TRACEABILITY_TUTOR_PROJECT.getName()
                + " # " + (projectRepository.countByOwner(user) + 1);
        TRACEABILITY_TUTOR_PROJECT.setName(projectName);
        TRACEABILITY_TUTOR_PROJECT.setOwner(user);
        return projectRepository.save(TRACEABILITY_TUTOR_PROJECT);
    }

    public Long createDemoProject(User user) {
        Project project = createDemoProjectInDb(user);
        setProjectData(project);
        return project.getId();
    }

    @Getter
    private static class TempCreateItemDTO extends CreateItemDTO {
        private final Long id;

        @JsonCreator
        public TempCreateItemDTO(
                @JsonProperty("id") Long id,
                @JsonProperty("projectId") @NotBlank Long projectId,
                @JsonProperty("itemType") @NotNull ItemType itemType,
                @JsonProperty("data") @NotNull Map<String, String> data,
                @JsonProperty("status") @Size(max = 255) String status) {
            super(projectId, itemType, data, status);
            this.id = id;
            this.setProjectId(TRACEABILITY_TUTOR_PROJECT.getId());
        }

    }

    @Getter
    private static class TempCreateRelationshipDTO extends CreateRelationshipDTO {
        private final Long id;

        @JsonCreator
        public TempCreateRelationshipDTO(
                @JsonProperty("id") Long id,
                @JsonProperty("relationshipType") @NotNull RelationshipType relationshipType,
                @JsonProperty("description") @Size(max = 255) String description,
                @JsonProperty("startItem") @NotNull Long startItem,
                @JsonProperty("endItem") @NotNull Long endItem) {
            super(relationshipType, description, startItem, endItem);
            this.id = id;
        }

    }
}

