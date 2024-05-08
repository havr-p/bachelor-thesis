package uniba.fmph.traceability_tutor.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.config.UserAuthenticationProvider;
import uniba.fmph.traceability_tutor.model.CredentialsDTO;
import uniba.fmph.traceability_tutor.model.SignUpDTO;
import uniba.fmph.traceability_tutor.model.UserDTO;
import uniba.fmph.traceability_tutor.service.UserService;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final UserAuthenticationProvider userAuthenticationProvider;


    @PostMapping("/api/login")
    public ResponseEntity<UserDTO> login(@RequestBody CredentialsDTO credentials) {
        UserDTO userDTO = userService.login(credentials);
        userDTO.setToken(userAuthenticationProvider.createToken(userDTO));
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/api/register")
    public ResponseEntity<UserDTO> register(@RequestBody @Valid SignUpDTO user) {
        UserDTO createdUser = userService.register(user);
        createdUser.setToken(userAuthenticationProvider.createToken(createdUser));
        return ResponseEntity.created(URI.create("/api/users/" + createdUser.getId())).body(createdUser);
    }

    @GetMapping("api/renewToken/{id}")
    public ResponseEntity<String> renewToken(@PathVariable Long id) {
        String token = this.userAuthenticationProvider.createToken(this.userService.findById(id));
        return ResponseEntity.ok(token);
    }
}
