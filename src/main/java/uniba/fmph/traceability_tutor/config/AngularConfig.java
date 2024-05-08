package uniba.fmph.traceability_tutor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class AngularConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(final CorsRegistry registry) {
                registry.addMapping("/**").allowedMethods("*")
                        .allowedOrigins("http://localhost:4200");
                // .allowedHeaders(HttpHeaders.AUTHORIZATION,
                //        HttpHeaders.CONTENT_TYPE, HttpHeaders.ACCEPT).maxAge(3600L);
            }

        };
    }

}
