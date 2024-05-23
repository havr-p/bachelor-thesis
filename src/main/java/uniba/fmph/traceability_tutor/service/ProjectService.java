package uniba.fmph.traceability_tutor.service;

import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.config.security.SecretsManager;
import uniba.fmph.traceability_tutor.domain.*;
import uniba.fmph.traceability_tutor.mapper.LevelMapper;
import uniba.fmph.traceability_tutor.mapper.ProjectMapper;
import uniba.fmph.traceability_tutor.model.CreateProjectDTO;
import uniba.fmph.traceability_tutor.model.ProjectDTO;
import uniba.fmph.traceability_tutor.model.UserSecretType;
import uniba.fmph.traceability_tutor.repos.*;
import uniba.fmph.traceability_tutor.runner.DatabaseInitializer;
import uniba.fmph.traceability_tutor.util.NotFoundException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ReleaseRepository releaseRepository;
    private final ProjectMapper projectMapper;
    private final LevelMapper levelMapper;
    private final SecretsManager secretsManager;
    private final DatabaseInitializer databaseInitializer;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository,
                          ItemRepository itemRepository, ReleaseRepository releaseRepository,
                          ProjectMapper projectMapper, LevelMapper levelMapper, SecretsManager secretsManager,
                          DatabaseInitializer databaseInitializer) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.releaseRepository = releaseRepository;
        this.projectMapper = projectMapper;
        this.levelMapper = levelMapper;
        this.secretsManager = secretsManager;
        this.databaseInitializer = databaseInitializer;
    }

    public List<ProjectDTO> findAll() {
        return projectRepository.findAll(Sort.by("id")).stream()
                .map(projectMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProjectDTO get(Long id) {
        var project = projectRepository.findById(id)
                .map(projectMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Project not found with id: " + id));
        return project;
    }

    public Long create(CreateProjectDTO projectDTO) {
        Project project = projectMapper.toEntity(projectDTO);
        User owner = getCurrentUser();
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
        final Release projectRelease = releaseRepository.findFirstByProject(project);
        if (projectRelease != null) {
            referencedWarning.setKey("project.release.project.referenced");
            referencedWarning.addParam(projectRelease.getId());
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
        }
        else throw new NotFoundException("User not found with id: " + id);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
    }

    public boolean existsByUserAndName(String projectName) {
        return projectRepository.existsByOwnerAndName(getCurrentUser(), projectName);
    }

    public Long createDemoProject() {
        var user = this.getCurrentUser();
        return databaseInitializer.createDemoProject(user);
    }
}
