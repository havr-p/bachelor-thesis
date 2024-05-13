package uniba.fmph.traceability_tutor.rest;

import org.kohsuke.github.GHRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import uniba.fmph.traceability_tutor.service.GitHubService;

import java.io.IOException;
import java.net.URL;
import java.util.List;

@RestController
@RequestMapping(value = "/api/git", produces = MediaType.APPLICATION_JSON_VALUE)
public class GitHubResource {


    private final WebClient webClient;

    public GitHubResource(@Qualifier("github") WebClient webClient, GitHubService githubService) {
        this.webClient = webClient;
    }

    @GetMapping("/repositories")
    public List<Repository> getPublicRepos() throws IOException {
        String url = "/user/repos?type=owner&since=2023-01-01T00:00:00Z";
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToFlux(Repository.class)
                .collectList()
                .block();
    }
}

