package uniba.fmph.traceability_tutor.service;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.domain.Item;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.Release;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.mapper.ProjectMapper;
import uniba.fmph.traceability_tutor.mapper.UserMapper;
import uniba.fmph.traceability_tutor.model.ProjectDTO;
import uniba.fmph.traceability_tutor.repos.ItemRepository;
import uniba.fmph.traceability_tutor.repos.ProjectRepository;
import uniba.fmph.traceability_tutor.repos.ReleaseRepository;
import uniba.fmph.traceability_tutor.repos.UserRepository;
import uniba.fmph.traceability_tutor.util.AppException;
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

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository,
                          ItemRepository itemRepository, ReleaseRepository releaseRepository,
                          ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.releaseRepository = releaseRepository;
        this.projectMapper = projectMapper;
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

    public Long create(ProjectDTO projectDTO) {
        Project project = projectMapper.toEntity(projectDTO);
        User owner = getCurrentUser();
        project.setOwner(owner);
        project.setLastOpened(OffsetDateTime.now()); // Set the last opened time when creating
        return projectRepository.save(project).getId();
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
            return projectRepository.findAllByOwner(owner.get(), Sort.by(Sort.Direction.DESC, "lastOpened")).stream()
                    .map(projectMapper::toDto)
                    .collect(Collectors.toList());
        }
        else throw new NotFoundException("User not found with id: " + id);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String githubId = authentication.getName(); // Assuming the username is the GitHub ID for simplicity
        return userRepository.findByGithubId(githubId)
                .orElseThrow(() -> new NotFoundException("User not found with GitHub ID: " + githubId));
    }

}
