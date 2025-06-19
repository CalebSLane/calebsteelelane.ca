package ca.calebsteelelane.csl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the csl application.
 */
@SpringBootApplication
public class CslApplication {

  /**
   * The entry point of the Spring Boot application.
   *
   * @param args command-line arguments passed to the application
   */
  public static void main(String[] args) {
    SpringApplication.run(CslApplication.class, args);
  }
}
