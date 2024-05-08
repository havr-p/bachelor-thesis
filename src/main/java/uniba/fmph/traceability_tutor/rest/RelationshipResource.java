package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.model.RelationshipDTO;
import uniba.fmph.traceability_tutor.service.RelationshipService;

import java.util.List;


@RestController
@RequestMapping(value = "/api/relationships", produces = MediaType.APPLICATION_JSON_VALUE)
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
            @RequestBody @Valid final RelationshipDTO relationshipDTO) {
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

}
