package uniba.fmph.traceability_tutor.config;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import uniba.fmph.traceability_tutor.domain.InternalIdGenerator;

import java.time.OffsetDateTime;
import java.util.Optional;


@Configuration
@EntityScan("uniba.fmph.traceability_tutor.domain")
@EnableJpaRepositories("uniba.fmph.traceability_tutor.repos")
@EnableTransactionManagement
@EnableJpaAuditing(dateTimeProviderRef = "auditingDateTimeProvider")
public class DomainConfig {

    @Bean(name = "auditingDateTimeProvider")
    public DateTimeProvider dateTimeProvider() {
        return () -> Optional.of(OffsetDateTime.now());
    }

    @Bean(name = "internalIdGenerator")
    public InternalIdGenerator internalIdGenerator() {
        return new InternalIdGenerator();
    }

}
