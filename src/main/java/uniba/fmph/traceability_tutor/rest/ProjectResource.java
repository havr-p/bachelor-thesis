package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.exception.ProjectWithNameExistsException;
import uniba.fmph.traceability_tutor.model.*;
import uniba.fmph.traceability_tutor.service.ItemService;
import uniba.fmph.traceability_tutor.service.ProjectService;
import uniba.fmph.traceability_tutor.service.RelationshipService;
import uniba.fmph.traceability_tutor.util.AppException;
import uniba.fmph.traceability_tutor.util.ReferencedException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.io.IOException;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping(value = "/api/projects", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProjectResource {

    private final ProjectService projectService;

    private final ItemService itemService;
    private final RelationshipService relationshipService;

    public ProjectResource(final ProjectService projectService, ItemService itemService, RelationshipService relationshipService) {
        this.projectService = projectService;
        this.itemService = itemService;
        this.relationshipService = relationshipService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(projectService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createProject(@RequestBody @Valid final CreateProjectDTO createProjectDTO) {
        if (projectService.existsByUserAndName(createProjectDTO.getName())) {
            throw new ProjectWithNameExistsException("Project with name \"" + createProjectDTO.getName() + "\" already exists.");
        }
        final Long createdId = projectService.create(createProjectDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateProject(@PathVariable(name = "id") final Long id,
                                              @RequestBody @Valid final ProjectDTO projectDTO) {
        projectService.update(id, projectDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteProject(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = projectService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/open/{id}")
    public ResponseEntity<Long> updateLastOpened(@PathVariable(name = "id") final Long id) {
        projectService.updateLastOpened(id);
        return ResponseEntity.ok(id);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<ProjectDTO>> getUserProjects(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.of(Optional.ofNullable(projectService.findByOwner(id)));
    }

    @GetMapping("/demo")
    public ResponseEntity<Long> setupDemoProject() {
       return new ResponseEntity<>(projectService.createDemoProject(), HttpStatus.CREATED);
    }

    @GetMapping("/settings/{id}")
    public ResponseEntity<ProjectSettings> getProjectSettings(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(projectService.getProjectSettings(id));
    }

    @PutMapping("/settings/{id}")
    public ResponseEntity<Long> updateProjectSettings(@PathVariable(name = "id") final Long id, @RequestBody @Valid final ProjectSettings settings) {
        projectService.updateSettings(id, settings);
        return ResponseEntity.ok(id);
    }

    @PutMapping("/importEditorContents")
    @Transactional
    public ResponseEntity<ContentsDTO> importFile(@RequestParam(name = "id") final Long id, @RequestBody String fileContent) {
        try {
            Project project = projectService.getProjectById(id);
            projectService.clearProjectEditableContent(id);
            projectService.setProjectData(project, fileContent);
            return ResponseEntity.ok(new ContentsDTO(itemService.getProjectEditableItems(id), relationshipService.getProjectEditableRelationships(id)));
        } catch (IOException e) {
            throw new AppException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/createFromFile")
    @Transactional
    public ResponseEntity<ProjectFromFile> createFromFile(@RequestBody String fileContent) {
        try {
            Project project = new Project();
            project = projectService.setProjectData(project, fileContent);
            Long id = project.getId();
            ProjectDTO projectDTO = this.projectService.toDto(project);
            return ResponseEntity.ok(new ProjectFromFile( projectDTO,
                    new ContentsDTO(itemService.getProjectEditableItems(id), relationshipService.getProjectEditableRelationships(id))));
        } catch (IOException e) {
            throw new AppException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
