package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.model.CreateRelationshipDTO;
import uniba.fmph.traceability_tutor.model.ItemDTO;
import uniba.fmph.traceability_tutor.model.RelationshipDTO;
import uniba.fmph.traceability_tutor.service.RelationshipService;

import java.util.List;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;


@RestController
@RequestMapping(value = "/api/relationships", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = BEARER_SECURITY_SCHEME)
public class RelationshipResource {

    private final RelationshipService relationshipService;

    public RelationshipResource(final RelationshipService relationshipService) {
        this.relationshipService = relationshipService;
    }

    @GetMapping
    public ResponseEntity<List<RelationshipDTO>> getAllRelationships() {
        return ResponseEntity.ok(relationshipService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RelationshipDTO> getRelationship(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(relationshipService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createRelationship(
            @RequestBody @Valid final CreateRelationshipDTO relationshipDTO) {
        final Long createdId = relationshipService.create(relationshipDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateRelationship(@PathVariable(name = "id") final Long id,
                                                   @RequestBody @Valid final RelationshipDTO relationshipDTO) {
        relationshipService.update(id, relationshipDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteRelationship(@PathVariable(name = "id") final Long id) {
        relationshipService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /*Relationships will be edited even without release. Every edit operation requires work on server,
    so server will always store actual and valid state of relationships*/
    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping("/project/{id}")
    public ResponseEntity<List<RelationshipDTO>> getProjectEditableRelationships(@PathVariable(name = "id") final Long projectId) {
        return ResponseEntity.ok(relationshipService.getProjectEditableRelationships(projectId));
    }

}
