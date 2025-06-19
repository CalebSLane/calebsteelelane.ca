package ca.calebsteelelane.csl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Converts Keycloak resource access roles from a JWT into Spring Security GrantedAuthority objects.
 */
@Slf4j
public class KeycloakResourceAccessRolesConverter
  implements Converter<Jwt, Collection<GrantedAuthority>> {

  private static final String CLAIM_RESOURCE_ACCESS = "resource_access";
  private static final String CLAIM_ROLES = "roles";
  private static final String PREFIX = "ROLE_"; // Spring Security expects this prefix

  @Override
  public Collection<GrantedAuthority> convert(@NonNull Jwt jwt) {
    Collection<GrantedAuthority> authorities = new ArrayList<>();

    Map<String, Object> resourceAccess = jwt.getClaim(CLAIM_RESOURCE_ACCESS);
    if (resourceAccess != null) {
      resourceAccess.forEach((resource, value) -> {
        try {
          @SuppressWarnings("unchecked")
          Map<String, Object> resourceMap = (Map<String, Object>) value;
          @SuppressWarnings("unchecked")
          Collection<String> roles = (Collection<String>) resourceMap.get(CLAIM_ROLES);
          if (roles != null) {
            roles.forEach(role -> authorities.add(new SimpleGrantedAuthority(PREFIX + role)));
          }
        } catch (ClassCastException e) {
          // Handle the case where the value is not a Map or roles is not a Collection
          log.error(resource + " resource access roles are not in the expected format: " + value);
        }
      });
    }
    return authorities;
  }
}
