package ca.calebsteelelane.csl.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * DisabledSecurityIntegrationTestConfig is a configuration class for
 * integration tests.
 * It provides a bean to configure a security filter chain that disables OAuth2
 * security.
 */
@TestConfiguration
public class DisabledSecurityIntegrationTestConfig {

  /**
   * Configures a security filter chain to disable OAuth2 security for integration
   * tests.
   *
   * @param http the {@link HttpSecurity} to configure
   * @return the {@link SecurityFilterChain} configured to disable OAuth2 security
   * @throws Exception if an error occurs while configuring security
   */
  @Bean
  public SecurityFilterChain disableOauth2Security(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
      .build();
  }
}
