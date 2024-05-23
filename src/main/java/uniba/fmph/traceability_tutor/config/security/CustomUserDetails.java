package uniba.fmph.traceability_tutor.config.security;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import uniba.fmph.traceability_tutor.config.security.oauth.OAuth2Provider;

import java.util.Collection;
import java.util.Map;

@Data
public class CustomUserDetails implements OAuth2User, UserDetails {

    private Long id;
    private String password;
    private String name;
    private String email;
    private OAuth2Provider provider;
    private Collection<? extends GrantedAuthority> authorities;
    private Map<String, Object> attributes;

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
