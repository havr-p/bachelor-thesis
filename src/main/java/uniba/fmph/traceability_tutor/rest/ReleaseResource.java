package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.model.ReleaseDTO;
import uniba.fmph.traceability_tutor.service.ReleaseService;
import uniba.fmph.traceability_tutor.util.ReferencedException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.util.List;


@RestController
@RequestMapping(value = "/api/releases", produces = MediaType.APPLICATION_JSON_VALUE)
public class ReleaseResource {

    private final ReleaseService releaseService;

    public ReleaseResource(final ReleaseService releaseService) {
        this.releaseService = releaseService;
    }

    @GetMapping
    public ResponseEntity<List<ReleaseDTO>> getAllReleases() {
        return ResponseEntity.ok(releaseService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReleaseDTO> getRelease(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(releaseService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createRelease(@RequestBody @Valid final ReleaseDTO releaseDTO) {
        final Long createdId = releaseService.create(releaseDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateRelease(@PathVariable(name = "id") final Long id,
                                              @RequestBody @Valid final ReleaseDTO releaseDTO) {
        releaseService.update(id, releaseDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteRelease(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = releaseService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        releaseService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
