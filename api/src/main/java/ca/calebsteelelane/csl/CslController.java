package ca.calebsteelelane.csl;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * CslController is a REST controller that handles HTTP requests for the
 * application.
 * It provides endpoints for both public and secure access.
 *
 * <p>Endpoints:
 * <ul>
 * <li>{@code /} - Returns a greeting message "Hello World!"</li>
 * <li>{@code /secure} - Returns a secure greeting message "Hello Secure
 * World!"</li>
 * </ul>
 * </p>
 *
 * <p>Example usage:
 *
 * <pre>
 * {@code
 * // Access the public endpoint
 * GET http://localhost:8080/
 *
 * // Access the secure endpoint
 * GET http://localhost:8080/secure
 * }
 * </pre>
 * </p>
 *
 * @see org.springframework.web.bind.annotation.RestController
 * @see org.springframework.web.bind.annotation.RequestMapping
 */
@RestController
public class CslController {

  @RequestMapping("/")
  String home() {
    return "Hello World!";
  }

  @RequestMapping("/secure")
  String secureHome() {
    return "Hello Secure World!";
  }
}
