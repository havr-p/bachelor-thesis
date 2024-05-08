package uniba.fmph.traceability_tutor.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.mapper.UserMapper;
import uniba.fmph.traceability_tutor.model.UserDTO;
import uniba.fmph.traceability_tutor.repos.UserRepository;
import uniba.fmph.traceability_tutor.util.AppException;

import java.util.Base64;
import java.util.Date;

@RequiredArgsConstructor
@Component
public class UserAuthenticationProvider {

    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @PostConstruct
    protected void init() {
        // this is to avoid having the raw secret key available in the JVM
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(UserDTO user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600_000); // 1 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(user.getEmail())
                .withClaim("firstName", user.getFirstName())
                .withClaim("lastName", user.getLastName())
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .sign(algorithm);
    }


    public UserDTO findByToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        User user = userRepository.findByEmail(decoded.getSubject()).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.toUserDTO(user);
    }

    public Authentication validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        User user = userRepository.findByEmail(decoded.getSubject()).orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    }
}
