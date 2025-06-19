package ca.calebsteelelane.csl;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration class that sets up custom security coinfiguration
 * for handling HTTP requests such as OAuth2 login, and logout.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  /**
   * Configures the security filter chain for handling HTTP requests, OAuth2
   * login, and logout.
   *
   * @param http HttpSecurity object to define web-based security at the HTTP
   *             level
   * @return SecurityFilterChain for filtering and securing HTTP requests
   * @throws Exception in case of an error during configuration
   */
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      // Configures authorization rules for different endpoints
      .authorizeHttpRequests(
        authorize ->
          authorize //
            .requestMatchers("/secure") //
            .authenticated() //
            .anyRequest() //
            .permitAll() // allow any other request
      )
      .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
      .sessionManagement(sessions -> {
        sessions.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
      })
      .csrf(csrf -> {
        csrf.disable();
      });
    return http.build();
  }

  /**
   * Creates a JwtAuthenticationConverter bean that uses a custom converter
   * for extracting authorities from JWT tokens.
   *
   * @return a configured JwtAuthenticationConverter
   */
  @Bean("JwtAuthenticationConverter")
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(new KeycloakResourceAccessRolesConverter());
    return converter;
  }
}
