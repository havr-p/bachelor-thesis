package uniba.fmph.traceability_tutor.runner;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uniba.fmph.traceability_tutor.config.security.SecurityConfig;
import uniba.fmph.traceability_tutor.config.security.oauth.OAuth2Provider;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.service.ProjectService;
import uniba.fmph.traceability_tutor.service.UserService;

import java.util.Arrays;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final ProjectService projectService;
    private final List<User> USERS = Arrays.asList(
            new User("admin@test.com", "admin", "admin", SecurityConfig.ADMIN, OAuth2Provider.LOCAL),
            new User("user@test.com", "user", "user", SecurityConfig.USER, OAuth2Provider.LOCAL)
    );
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userService.getUsers().isEmpty()) {
            USERS.forEach(user -> {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userService.saveUser(user);
            });
            Project project = projectService.createDemoProjectInDb(USERS.get(0));
            projectService.setSampleProjectData(project);
            log.info("Database initialized");
        }
    }



}

