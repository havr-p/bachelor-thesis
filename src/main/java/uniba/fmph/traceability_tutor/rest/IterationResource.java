package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.domain.Iteration;
import uniba.fmph.traceability_tutor.model.CreateIterationRequest;
import uniba.fmph.traceability_tutor.model.IterationDTO;
import uniba.fmph.traceability_tutor.service.ItemService;
import uniba.fmph.traceability_tutor.service.IterationService;
import uniba.fmph.traceability_tutor.service.RelationshipService;
import uniba.fmph.traceability_tutor.util.ReferencedException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.util.List;


@RestController
@RequestMapping(value = "/api/iterations", produces = MediaType.APPLICATION_JSON_VALUE)
public class IterationResource {

    private final IterationService iterationService;
    private final ItemService itemService;
    private final RelationshipService relationshipService;

    public IterationResource(final IterationService iterationService, ItemService itemService, RelationshipService relationshipService) {
        this.iterationService = iterationService;
        this.itemService = itemService;
        this.relationshipService = relationshipService;
    }

    @GetMapping
    public ResponseEntity<List<IterationDTO>> getAllIterations() {
        return ResponseEntity.ok(iterationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IterationDTO> getIteration(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(iterationService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<IterationDTO> createIteration(@RequestBody @Valid final CreateIterationRequest request) {
        try {
            Iteration iteration = iterationService.createLastestIteration(request.projectId());
            for (Long itemId:
                    request.itemIds()) {
                this.itemService.setIteration(itemId, iteration);
            }
            for (Long relationshipId:
                    request.relationshipIds()) {
                this.relationshipService.setIteration(relationshipId, iteration);
            }
            IterationDTO dto = new IterationDTO();
            dto = iterationService.mapToDTO(iteration, dto);
            return new ResponseEntity<>(dto, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateIteration(@PathVariable(name = "id") final Long id,
                                              @RequestBody @Valid final IterationDTO iterationDTO) {
        iterationService.update(id, iterationDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteIteration(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = iterationService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        iterationService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
