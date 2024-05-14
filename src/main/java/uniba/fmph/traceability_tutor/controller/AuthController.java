package uniba.fmph.traceability_tutor.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import uniba.fmph.traceability_tutor.config.security.TokenProvider;
import uniba.fmph.traceability_tutor.config.security.oauth.OAuth2Provider;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.exception.DuplicatedUserInfoException;
import uniba.fmph.traceability_tutor.mapper.UserMapper;
import uniba.fmph.traceability_tutor.model.AuthResponse;
import uniba.fmph.traceability_tutor.model.LoginRequest;
import uniba.fmph.traceability_tutor.model.SignUpRequest;
import uniba.fmph.traceability_tutor.service.UserService;

import static uniba.fmph.traceability_tutor.config.security.SecurityConfig.USER;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final UserMapper userMapper;

    @PostMapping("/authenticate")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest loginRequest) {
        String token = authenticateAndGetToken(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userService.hasUserWithEmail(signUpRequest.getEmail())) {
            throw new DuplicatedUserInfoException(String.format("Email %s already been used", signUpRequest.getEmail()));
        }

        userService.saveUser(mapSignUpRequestToUser(signUpRequest));

        String token = authenticateAndGetToken(signUpRequest.getEmail(), signUpRequest.getPassword());
        return ResponseEntity.ok(token);
    }

    private String authenticateAndGetToken(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        return tokenProvider.generate(authentication);
    }

    private User mapSignUpRequestToUser(SignUpRequest signUpRequest) {
        User user = new User();
        user.setUsername(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setRole(USER);
        user.setProvider(OAuth2Provider.LOCAL);
        return user;
    }
}
