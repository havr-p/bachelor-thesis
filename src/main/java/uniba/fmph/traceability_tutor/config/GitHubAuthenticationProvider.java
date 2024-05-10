//package uniba.fmph.traceability_tutor.config;
//
//import com.auth0.jwt.JWT;
//import com.auth0.jwt.JWTVerifier;
//import com.auth0.jwt.algorithms.Algorithm;
//import com.auth0.jwt.interfaces.DecodedJWT;
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import java.io.File;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.security.KeyFactory;
//import java.security.interfaces.RSAPrivateKey;
//import java.security.spec.PKCS8EncodedKeySpec;
//import java.util.Date;
//
//@Component
//public class GitHubAuthenticationProvider {
//    @Value("${github.app.id}")
//    private String githubAppId;
//
//    @Value("${github.private-key-file}")
//    private String privateKeyFile;
//
//    private Algorithm rsaAlgorithm;
//
//    @PostConstruct
//    protected void init() throws Exception {
//        // Retrieve and initialize RSA algorithm using the private key file
//        RSAPrivateKey privateKey = (RSAPrivateKey) getPrivateKey(privateKeyFile);
//        rsaAlgorithm = Algorithm.RSA256(null, privateKey);
//    }
//
//    /**
//     * Retrieve an RSA private key from a specified file.
//     *
//     * @param filename Path to the private key file
//     * @return RSAPrivateKey object
//     * @throws Exception In case of errors during key file reading
//     */
//    private static RSAPrivateKey getPrivateKey(String filename) throws Exception {
//        Path path = new File(filename).toPath();
//        byte[] keyBytes = Files.readAllBytes(path);
//
//        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
//        KeyFactory kf = KeyFactory.getInstance("RSA");
//        return (RSAPrivateKey) kf.generatePrivate(spec);
//    }
//
//    /**
//     * Generate a signed JWT for GitHub API authentication.
//     *
//     * @param ttlMillis Expiration time in milliseconds
//     * @return JWT token string
//     */
//    public String createToken(long ttlMillis) {
//        Date now = new Date();
//        Date validity = new Date(now.getTime() + ttlMillis);
//
//        // Build and sign JWT using the RSA algorithm
//        return JWT.create()
//                .withIssuer(githubAppId)
//                .withIssuedAt(now)
//                .withExpiresAt(validity)
//                .sign(rsaAlgorithm);
//    }
//
//    /**
//     * Verifies and decodes a JWT token.
//     *
//     * @param token The JWT token string
//     * @return DecodedJWT object
//     */
//    public DecodedJWT decodeToken(String token) {
//        JWTVerifier verifier = JWT.require(rsaAlgorithm).build();
//        return verifier.verify(token);
//    }
//
//
//}
