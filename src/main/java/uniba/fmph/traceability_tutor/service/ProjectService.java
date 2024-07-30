package uniba.fmph.traceability_tutor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uniba.fmph.traceability_tutor.config.security.SecretsManager;
import uniba.fmph.traceability_tutor.domain.*;
import uniba.fmph.traceability_tutor.mapper.ItemMapper;
import uniba.fmph.traceability_tutor.mapper.ProjectMapper;
import uniba.fmph.traceability_tutor.mapper.RelationshipMapper;
import uniba.fmph.traceability_tutor.model.*;
import uniba.fmph.traceability_tutor.repos.*;
import uniba.fmph.traceability_tutor.util.NotFoundException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static uniba.fmph.traceability_tutor.service.TempCreateRelationshipDTO.readResourceFile;
import static uniba.fmph.traceability_tutor.util.TextUtils.normalizeText;


@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final IterationRepository iterationRepository;
    private final RelationshipRepository relationshipRepository;
    private final ProjectMapper projectMapper;
    private final SecretsManager secretsManager;
    private final UserService userService;
    private final ItemService itemService;
    private final RelationshipService relationshipService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RelationshipMapper relationshipMapper;
    private final ItemMapper itemMapper;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository,
                          ItemRepository itemRepository, IterationRepository iterationRepository,
                          RelationshipRepository relationshipRepository, ProjectMapper projectMapper, SecretsManager secretsManager,
                          UserService userService, ItemService itemService, RelationshipService relationshipService, RelationshipMapper relationshipMapper,
                          ItemMapper itemMapper) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.iterationRepository = iterationRepository;
        this.relationshipRepository = relationshipRepository;
        this.projectMapper = projectMapper;
        this.secretsManager = secretsManager;
        this.userService = userService;
        this.itemService = itemService;
        this.relationshipService = relationshipService;
        this.relationshipMapper = relationshipMapper;
        this.itemMapper = itemMapper;
    }

    public List<ProjectDTO> findAll() {
        return projectRepository.findAll(Sort.by("id")).stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProjectDTO get(Long id) {
        return projectRepository.findById(id)
                .map(projectMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Project not found with id: " + id));
    }

    public Long create(CreateProjectDTO projectDTO) {
        Project project = projectMapper.toEntity(projectDTO);
        User owner = userService.getCurrentUser();
        project.setOwner(owner);
        project.setLastOpened(OffsetDateTime.now());

        if (projectDTO.getLevels() != null) {
            List<Level> levels = projectDTO.getLevels().stream()
                    .map(levelDTO -> {
                        Level level = projectMapper.toLevel(levelDTO);
                        level.setProject(project);
                        return level;
                    })
                    .toList();
            project.setLevels(levels);
        }

        Project savedProject = projectRepository.save(project);

        secretsManager.storeSecret(owner, UserSecretType.GITHUB_ACCESS_TOKEN, projectDTO.getAccessToken(), savedProject);

        return savedProject.getId();
    }


    public void update(final Long id, final ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Project not found with id: " + id));

        projectMapper.updateProjectFromDto(projectDTO, project);

        User owner = userRepository.findById(projectDTO.getOwner())
                .orElseThrow(() -> new NotFoundException("Owner not found"));
        project.setOwner(owner);

        projectRepository.save(project);
    }

    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new NotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    public ReferencedWarning getReferencedWarning(final Long id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Project project = projectRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final Item projectItem = itemRepository.findFirstByProject(project);
        if (projectItem != null) {
            referencedWarning.setKey("project.item.project.referenced");
            referencedWarning.addParam(projectItem.getId());
            return referencedWarning;
        }
        final Iteration projectIteration = iterationRepository.findFirstByProject(project);
        if (projectIteration != null) {
            referencedWarning.setKey("project.release.project.referenced");
            referencedWarning.addParam(projectIteration.getId());
            return referencedWarning;
        }
        return null;
    }

    public Long updateLastOpened(final Long id) {
        Project project = projectRepository.findById(id).orElseThrow(NotFoundException::new);
        project.setLastOpened(OffsetDateTime.now());
        return projectRepository.save(project).getId();
    }

    public List<ProjectDTO> findByOwner(final Long id) {
        Optional<User> owner = userRepository.findById(id);
        if (owner.isPresent()) {
            var result = projectRepository.findAllByOwner(owner.get(), Sort.by(Sort.Direction.DESC, "lastOpened")).stream()
                    .map(projectMapper::toDto)
                    .toList();
            return result;
        } else throw new NotFoundException("User not found with id: " + id);
    }


    public boolean existsByUserAndName(String projectName) {
        return projectRepository.existsByOwnerAndName(userService.getCurrentUser(), projectName);
    }

    @Transactional
    public Long createDemoProject() {
        var user = userService.getCurrentUser();
        return createDemoProjectWithData(user);
    }

    public void setVCSSecret(Long projectId) {
        var user = userService.getCurrentUser();
        var project = projectRepository.findById(projectId).orElseThrow(() -> new NotFoundException("Project with id " + projectId + " was not found."));
        String secret = secretsManager.retrieveSecret(user, project, UserSecretType.GITHUB_ACCESS_TOKEN);

    }

    public ProjectSettings getProjectSettings(Long id) {
        var project = projectRepository.findById(id).orElseThrow(() -> new NotFoundException("Project with id " + id + " was not found."));
        var user = userService.getCurrentUser();
        String secret = secretsManager.retrieveSecret(user, project, UserSecretType.GITHUB_ACCESS_TOKEN);
        return new ProjectSettings(project.getName(), project.getRepoName(), secret);
    }

    public void updateSettings(Long id, ProjectSettings settings) {
        var project = projectRepository.findById(id).orElseThrow(() -> new NotFoundException("Project with id " + id + " was not found."));
        project.setName(settings.name());
        project.setRepoName(settings.repoName());
        projectRepository.save(project);
        secretsManager.storeSecret(
                userService.getCurrentUser(),
                UserSecretType.GITHUB_ACCESS_TOKEN,
                settings.accessToken(),
                project
        );
    }

    private Project processProjectSettings(Project project, ProjectSettings settings) {
        project.setName(project.getName());
        project.setRepoName(project.getRepoName());
        project = projectRepository.save(project);
        var user = userService.getCurrentUser();
        secretsManager.storeSecret(user, UserSecretType.GITHUB_ACCESS_TOKEN, settings.accessToken(), project);
        return project;
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new NotFoundException("project with id = " + id + " not found"));
    }

    @Transactional
    public Long createDemoProjectWithData(User user) {
        Project project = createDemoProjectInDb(user);
        setSampleProjectData(project);
        return project.getId();
    }

    public Project setProjectData(Project project, String content) throws IOException {
        this.relationshipService.setCurrentProject(project);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(content);

        List<JsonItemDTO> itemDTOS = mapper.readValue(
                rootNode.get("items").toString(),
                mapper.getTypeFactory().constructCollectionType(List.class, JsonItemDTO.class)
        );
        List<ItemDTO> normalDTOs = itemDTOS.stream().map(itemMapper::jsonItemDtoToItemDto).toList();

        for (ItemDTO dto:
             normalDTOs) {
            var data = dto.getData();
            String description = data.get("description");
            String name = data.get("name");
            data.put("description", normalizeText(description));
            data.put("name", normalizeText(name));
        }

        Project finalProject = project;
        List<Item> items = itemDTOS.stream()
                .map(dto -> mapToEntity(finalProject, dto))
                .toList();
        itemRepository.saveAllAndFlush(items);

        List<JsonRelationshipDTO> jsonRelationshipDTOS = mapper.readValue(
                rootNode.get("relationships").toString(),
                mapper.getTypeFactory().constructCollectionType(List.class, JsonRelationshipDTO.class)
        );

        jsonRelationshipDTOS.forEach(dto -> dto.setDescription(normalizeText(dto.getDescription())));



        jsonRelationshipDTOS
                .forEach(dto -> {
                    CreateRelationshipDTO normalDTO = relationshipMapper.jsonToDto(dto);
                    relationshipService.create(normalDTO);
                });
        if (rootNode.has("projectSettings")) {
            ProjectSettings settings = mapper.treeToValue(rootNode.get("projectSettings"), ProjectSettings.class);
            project = processProjectSettings(project, settings);
        }

        return project;
    }

    public Item mapToEntity(Project project, final TempCreateItemDTO dto) {
        Item item = new Item();

        var data = dto.getData();
        item.setItemType(dto.getItemType());
        item.setData(data);
        item.setStatus(dto.getStatus());
        item.setProject(project);
        item.setInternalId(dto.internalId);
        return item;
    }

    public Item mapToEntity(Project project, final JsonItemDTO dto) {
        Item item = new Item();

        item.setItemType(dto.getItemType());

        Map<String, String> stringData = dto.getData().entrySet().stream()
                .filter(entry -> entry.getValue() != null)  // Filter out null values
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            Object value = entry.getValue();
                            if (value instanceof List) {
                                // Handle lists (like "links") by converting to JSON string
                                try {
                                    return new ObjectMapper().writeValueAsString(value);
                                } catch (JsonProcessingException e) {
                                    throw new RuntimeException("Error converting list to JSON", e);
                                }
                            }
                            return value.toString();
                        }
                ));

        item.setData(stringData);
        item.setStatus(dto.getStatus());
        item.setProject(project);
        item.setInternalId(dto.getInternalId());
        return item;
    }


    @Transactional
    public void setSampleProjectData(Project project) {
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
        var list = tempItemDtos.stream().map(dto -> this.mapToEntity(project, dto)).toList();
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
                        this.relationshipService.mapToEntity(dto, project))
                .toList();

        relationshipRepository.saveAll(relationships);

    }

    private List<TempCreateItemDTO> parseJsonToCreateItemDTOs() throws IOException {
        String ITEMS_JSON_FILE_PATH = "static/tt-requirements.json";
        String jsonContent = readResourceFile(ITEMS_JSON_FILE_PATH);
        return objectMapper.readValue(jsonContent, new TypeReference<>() {
        });
    }

    private List<TempCreateRelationshipDTO> parseJsonCreateRelationshipDTOs() throws IOException {
        String RELATIONSHIPS_JSON_FILE_PATH = "static/tt-relationships.json";
        String jsonContent = readResourceFile(RELATIONSHIPS_JSON_FILE_PATH);
        return objectMapper.readValue(jsonContent, new TypeReference<>() {
        });
    }

    public Project createDemoProjectInDb(User user) {
        String TRACEABILITY_TUTOR_PROJECT_REPO_NAME = "traceability-tutor";
        String TRACEABILITY_TUTOR_PROJECT_NAME = "Traceability Tutor";
        List<Level> BABOK_LEVELS = Arrays.asList(
                new Level(null, "#fcf6bd", "Business", null),
                new Level(null, "#ff99c8", "Stakeholder", null),
                new Level(null, "#d0f4de", "Solution", null),
                new Level(null, "#FFD275", "Design", null),
                new Level(null, "#a9def9", "Code", null),
                new Level(null, "#e4c1f9", "Test", null)
        );
        Project traceabilityTutorProject = Project.builder()
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

    public void clearProjectEditableContent(Long projectId) {
        this.itemService.deleteAllEditable(projectId);
        this.relationshipService.deleteAllEditable(projectId);
    }

    public ProjectDTO toDto(Project project) {
        return projectMapper.toDto(project);
    }
}
