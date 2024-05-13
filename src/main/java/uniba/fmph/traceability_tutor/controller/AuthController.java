package uniba.fmph.traceability_tutor.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.result.view.RedirectView;
import uniba.fmph.traceability_tutor.config.security.TokenProvider;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.exception.DuplicatedUserInfoException;
import uniba.fmph.traceability_tutor.model.AuthResponse;
import uniba.fmph.traceability_tutor.model.LoginRequest;
import uniba.fmph.traceability_tutor.repos.UserRepository;
import uniba.fmph.traceability_tutor.service.GitHubService;
import uniba.fmph.traceability_tutor.service.UserService;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    @PostMapping("/authenticate")
    public AuthResponse login(@Valid @RequestBody LoginRequest loginRequest) {
        String token = authenticateAndGetToken(loginRequest.getUsername(), loginRequest.getPassword());
        return new AuthResponse(token);
    }

//    @ResponseStatus(HttpStatus.CREATED)
//    @PostMapping("/signup")
//    public AuthResponse signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
//        if (userService.hasUserWithUsername(signUpRequest.getUsername())) {
//            throw new DuplicatedUserInfoException(String.format("Username %s already been used", signUpRequest.getUsername()));
//        }
//        if (userService.hasUserWithEmail(signUpRequest.getEmail())) {
//            throw new DuplicatedUserInfoException(String.format("Email %s already been used", signUpRequest.getEmail()));
//        }
//
//        userService.saveUser(mapSignUpRequestToUser(signUpRequest));
//
//        String token = authenticateAndGetToken(signUpRequest.getUsername(), signUpRequest.getPassword());
//        return new AuthResponse(token);
//    }

    private String authenticateAndGetToken(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        return tokenProvider.generate(authentication);
    }

//    private User mapSignUpRequestToUser(SignUpRequest signUpRequest) {
//        User user = new User();
//        user.setUsername(signUpRequest.getUsername());
//        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
//        user.setName(signUpRequest.getName());
//        user.setEmail(signUpRequest.getEmail());
//        user.setRole(WebSecurityConfig.USER);
//        user.setProvider(OAuth2Provider.LOCAL);
//        return user;
//    }
}
