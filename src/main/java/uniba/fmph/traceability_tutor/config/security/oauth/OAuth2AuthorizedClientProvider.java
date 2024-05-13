package uniba.fmph.traceability_tutor.config.security.oauth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class OAuth2AuthorizedClientProvider {
    @Autowired
    private OAuth2AuthorizedClientService clientService;

    public OAuth2AuthorizedClient getClient() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        return clientService.loadAuthorizedClient(oauthToken.getAuthorizedClientRegistrationId(), oauthToken.getName());
    }
    public String getAccessToken() {
        OAuth2AuthorizedClient client = getClient();
        if (client != null && client.getAccessToken() != null) {
            return client.getAccessToken().getTokenValue();
        }
        return null; // or handle this case as needed
    }
}
