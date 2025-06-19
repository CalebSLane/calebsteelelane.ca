package ca.calebsteelelane.csl;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * Integration Test class for CslController.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CslControllerIT {

  @Test
  public void homeReturnsHelloWorld(@Autowired MockMvc mockMvc) throws Exception {
    mockMvc
      .perform(MockMvcRequestBuilders.get("/"))
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.content().string("Hello World!"));
  }

  @WithMockUser(value = "spring")
  @Test
  public void secureReturnsHelloSecureWorld(@Autowired MockMvc mockMvc) throws Exception {
    mockMvc
      .perform(MockMvcRequestBuilders.get("/secure"))
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andExpect(MockMvcResultMatchers.content().string("Hello Secure World!"));
  }
}
