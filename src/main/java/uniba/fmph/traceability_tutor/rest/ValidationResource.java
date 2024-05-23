package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uniba.fmph.traceability_tutor.model.ValidationResult;
import uniba.fmph.traceability_tutor.service.ItemService;
import uniba.fmph.traceability_tutor.service.RelationshipService;
import uniba.fmph.traceability_tutor.service.ReleaseService;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;

@RestController
@RequestMapping(value = "/api/validations", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = BEARER_SECURITY_SCHEME)
@RequiredArgsConstructor
public class ValidationResource {

    private final RelationshipService relationshipService;
    private final ItemService itemService;
    private final ReleaseService releaseService;


//     @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
//    @GetMapping("/connection/add/")
//    public ResponseEntity<> getProjectEditableRelationships(@PathVariable(name = "id") final Long projectId) {
//        return (ResponseEntity) ResponseEntity.ok();
//    }
}
