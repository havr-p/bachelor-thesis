package uniba.fmph.traceability_tutor.config.security;

import lombok.AllArgsConstructor;
import org.jasypt.encryption.StringEncryptor;
import org.springframework.stereotype.Service;
import uniba.fmph.traceability_tutor.domain.Project;
import uniba.fmph.traceability_tutor.domain.User;
import uniba.fmph.traceability_tutor.domain.UserSecret;
import uniba.fmph.traceability_tutor.model.UserSecretType;
import uniba.fmph.traceability_tutor.repos.UserSecretRepository;
import uniba.fmph.traceability_tutor.util.NotFoundException;



@Service
@AllArgsConstructor
public class SecretsManager {

    private StringEncryptor encryptor;

    private UserSecretRepository secretsRepository;

    public void storeSecret(User user, UserSecretType secretType, String secret, Project project) {
        String encryptedSecret = encryptor.encrypt(secret);
        UserSecret userSecret = UserSecret.builder()
                .user(user)
                .secretType(secretType)
                .secretValue(encryptedSecret)
                .project(project)
                .build();
        secretsRepository.save(userSecret);
    }

    public String retrieveSecret(User user, Project project, UserSecretType secretType) {
        var secret = secretsRepository.findByUserAndProjectAndSecretType(user, project, secretType);
        if (secret.isPresent()) {
            return encryptor.decrypt(secret.get().getSecretValue());
        }
        else throw new NotFoundException("User access token for given project repository was not found");
    }
}
