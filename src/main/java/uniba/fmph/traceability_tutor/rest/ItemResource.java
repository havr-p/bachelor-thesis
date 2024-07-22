package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.model.CreateItemDTO;
import uniba.fmph.traceability_tutor.model.ItemDTO;
import uniba.fmph.traceability_tutor.service.ItemService;

import java.util.List;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;


@RestController
@RequestMapping(value = "/api/items", produces = MediaType.APPLICATION_JSON_VALUE)
public class ItemResource {

    private final ItemService itemService;

    public ItemResource(final ItemService itemService) {
        this.itemService = itemService;
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        return ResponseEntity.ok(itemService.findAll());
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItem(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(itemService.get(id));
    }


    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<ItemDTO> createItem(@RequestBody @Valid final CreateItemDTO createItemDTO) {
        final ItemDTO itemDTO = itemService.create(createItemDTO);
        return new ResponseEntity<>(itemDTO, HttpStatus.CREATED);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @PutMapping("/{id}")
    public ResponseEntity<Long> updateItem(@PathVariable(name = "id") final Long id,
                                           @RequestBody @Valid final ItemDTO itemDTO) {
        itemService.update(id, itemDTO);
        return ResponseEntity.ok(id);
    }

    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteItem(@PathVariable(name = "id") final Long id) {
//        final ReferencedWarning referencedWarning = itemService.getReferencedWarning(id);
//        if (referencedWarning != null) {
//            throw new ReferencedException(referencedWarning);
//        }
        itemService.deleteIfExists(id);
        return ResponseEntity.noContent().build();
    }

    /*Items will be edited even without release. Every edit operation requires work on server,
    so server will always store actual and valid state of items*/
    @Operation(security = {@SecurityRequirement(name = BEARER_SECURITY_SCHEME)})
    @GetMapping("/project/{id}")
    public ResponseEntity<List<ItemDTO>> getProjectEditableItems(@PathVariable(name = "id") final Long projectId) {
        return ResponseEntity.ok(itemService.getProjectEditableItems(projectId));
    }

}
