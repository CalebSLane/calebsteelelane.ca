package ca.calebsteelelane.csl;

import org.junit.jupiter.api.Test;
import org.springframework.util.Assert;

/**
 * Unit Test class for CslController.
 */
public class CslControllerTest {

  @Test
  public void homeReturnsHelloWorld() {
    CslController controller = new CslController();
    Assert.hasText(controller.home(), "Hello World!");
  }
}
