package uniba.fmph.traceability_tutor.config.security.oauth;

import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import uniba.fmph.traceability_tutor.config.security.CustomUserDetails;
import uniba.fmph.traceability_tutor.config.security.SecurityConfig;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.service.UserService;

import java.util.List;
import java.util.Optional;

@Component
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;
    private final List<OAuth2UserInfoExtractor> oAuth2UserInfoExtractors;

    public CustomOAuth2UserService(UserService userService, List<OAuth2UserInfoExtractor> oAuth2UserInfoExtractors) {
        this.userService = userService;
        this.oAuth2UserInfoExtractors = oAuth2UserInfoExtractors;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Optional<OAuth2UserInfoExtractor> oAuth2UserInfoExtractorOptional = oAuth2UserInfoExtractors.stream()
                .filter(oAuth2UserInfoExtractor -> oAuth2UserInfoExtractor.accepts(userRequest))
                .findFirst();
        if (oAuth2UserInfoExtractorOptional.isEmpty()) {
            throw new InternalAuthenticationServiceException("The OAuth2 provider is not supported yet");
        }

        CustomUserDetails customUserDetails = oAuth2UserInfoExtractorOptional.get().extractUserInfo(oAuth2User);
        User user = upsertUser(customUserDetails);
        customUserDetails.setId(user.getId());
        return customUserDetails;
    }

    private User upsertUser(CustomUserDetails customUserDetails) {
        Optional<User> userOptional = userService.getUserByEmail(customUserDetails.getUsername());
        User user;
        if (userOptional.isEmpty()) {
            user = new User();
            user.setUsername(customUserDetails.getUsername());
            user.setName(customUserDetails.getName());
            user.setEmail(customUserDetails.getEmail());
            user.setProvider(customUserDetails.getProvider());
            user.setRole(SecurityConfig.USER);
            user.setGithubLogin(customUserDetails.getGitHubLogin());
        } else {
            user = userOptional.get();
            user.setEmail(customUserDetails.getEmail());
        }
        return userService.saveUser(user);
    }
}
