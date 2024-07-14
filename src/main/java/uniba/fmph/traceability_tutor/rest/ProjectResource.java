package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.exception.ProjectWithNameExistsException;
import uniba.fmph.traceability_tutor.model.CreateProjectDTO;
import uniba.fmph.traceability_tutor.model.ProjectDTO;
import uniba.fmph.traceability_tutor.model.ProjectSettings;
import uniba.fmph.traceability_tutor.service.ProjectService;
import uniba.fmph.traceability_tutor.util.ReferencedException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping(value = "/api/projects", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProjectResource {

    private final ProjectService projectService;

    public ProjectResource(final ProjectService projectService) {
        this.projectService = projectService;
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


}
