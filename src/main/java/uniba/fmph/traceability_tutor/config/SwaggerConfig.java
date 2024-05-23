package uniba.fmph.traceability_tutor.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.*;
import io.swagger.v3.oas.models.responses.ApiResponse;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static uniba.fmph.traceability_tutor.config.SwaggerConfig.BEARER_SECURITY_SCHEME;


@Configuration
@SecurityScheme(
        name = BEARER_SECURITY_SCHEME,
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class SwaggerConfig {
    static {
        // use Reusable Enums for Swagger generation:
        // see https://springdoc.org/#how-can-i-apply-enumasref-true-to-all-enums
        io.swagger.v3.core.jackson.ModelResolver.enumsAsRef = true;
    }

    @Value("${spring.application.name}")
    private String applicationName;

    @Bean
    public OpenAPI openApiSpec() {
        return new OpenAPI().components(new Components()
                .addSchemas("ApiErrorResponse", new ObjectSchema()
                        .addProperty("status", new IntegerSchema())
                        .addProperty("code", new StringSchema())
                        .addProperty("message", new StringSchema())
                        .addProperty("fieldErrors", new ArraySchema().items(
                                new Schema<ArraySchema>().$ref("ApiFieldError"))))
                .addSchemas("ApiFieldError", new ObjectSchema()
                        .addProperty("code", new StringSchema())
                        .addProperty("message", new StringSchema())
                        .addProperty("property", new StringSchema())
                        .addProperty("rejectedValue", new ObjectSchema())
                        .addProperty("path", new StringSchema())))
                .info(new Info().title(applicationName));
    }

    @Bean
    public OperationCustomizer operationCustomizer() {
        // add error type to each operation
        return (operation, handlerMethod) -> {
            operation.getResponses().addApiResponse("4xx/5xx", new ApiResponse()
                    .description("Error")
                    .content(new Content().addMediaType("*/*", new MediaType().schema(
                            new Schema<MediaType>().$ref("ApiErrorResponse")))));
            return operation;
        };
    }
    public static final String BEARER_SECURITY_SCHEME = "bearer-key";

}
