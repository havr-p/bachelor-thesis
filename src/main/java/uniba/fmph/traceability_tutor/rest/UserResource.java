package uniba.fmph.traceability_tutor.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.config.security.CustomUserDetails;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.mapper.UserMapper;
import uniba.fmph.traceability_tutor.model.UserDTO;
import uniba.fmph.traceability_tutor.service.UserService;
import uniba.fmph.traceability_tutor.util.ReferencedException;
import uniba.fmph.traceability_tutor.util.ReferencedWarning;

import java.util.List;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;


@RestController
@RequestMapping(value = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserResource {

    private final UserService userService;
    private UserMapper userMapper;

    @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
    @GetMapping("/me")
    public UserDTO getCurrentUser(@AuthenticationPrincipal CustomUserDetails currentUser) {
        User user = userService.validateAndGetUserByEmail(currentUser.getUsername());
        return userMapper.toUserDTO(user);
    }


    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(userService.get(id));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Long> updateUser(@PathVariable(name = "id") final Long id,
                                           @RequestBody @Valid final UserDTO userDTO) {
        userService.update(id, userDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteUser(@PathVariable(name = "id") final Long id) {
        final ReferencedWarning referencedWarning = userService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }



}
