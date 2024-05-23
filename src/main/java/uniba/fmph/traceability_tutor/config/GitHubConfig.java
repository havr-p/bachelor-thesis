package uniba.fmph.traceability_tutor.config;

import org.kohsuke.github.GitHub;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.oauth2.client.CommonOAuth2Provider;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import uniba.fmph.traceability_tutor.config.security.oauth.OAuth2AuthorizedClientProvider;

import java.io.IOException;

@Configuration
public class GitHubConfig {
    @Bean
    @Qualifier("github_oauth2")
    WebClient webClientOAuth2(ClientRegistrationRepository clientRegistrations,
                        OAuth2AuthorizedClientRepository authorizedClients) {
        var oauth = new ServletOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrations, authorizedClients);
        oauth.setDefaultClientRegistrationId(CommonOAuth2Provider.GITHUB.name().toLowerCase());
        return WebClient.builder()
                .apply(oauth.oauth2Configuration())
                .baseUrl("https://api.github.com")
                .build();
    }

    @Bean
    @Qualifier("github")
    WebClient webClient() {
        return WebClient.builder()
                .baseUrl("https://api.github.com")
                .build();
    }

    GitHub github(OAuth2AuthorizedClientProvider provider) throws IOException {
        String accessToken = provider.getAccessToken();
        return GitHub.connectUsingOAuth(accessToken);
    }
}
