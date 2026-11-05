package com.hamarashops;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class HamaraShopsCorsAndEndpointsTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Preflight CORS OPTIONS /api/v1/industries from production origin succeeds with 200 OK and CORS header")
    public void testPreflightCors_Industries_ProductionOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/industries")
                        .header("Origin", "https://hamarashops.com")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Content-Type,Accept,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://hamarashops.com"))
                .andExpect(header().string("Access-Control-Max-Age", "3600"));
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS /api/v1/company from www origin succeeds with 200 OK and CORS header")
    public void testPreflightCors_Company_WwwProductionOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/company")
                        .header("Origin", "https://www.hamarashops.com")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Content-Type,Accept,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://www.hamarashops.com"));
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS from localhost:5173 succeeds with 200 OK and CORS header")
    public void testPreflightCors_LocalhostOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/products")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Content-Type,Accept,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS from Cloud Run wildcard pattern succeeds with 200 OK and matching CORS header")
    public void testPreflightCors_CloudRunOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/industries")
                        .header("Origin", "https://frontend-807653380381.asia-south1.run.app")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Content-Type,Accept,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://frontend-807653380381.asia-south1.run.app"));
    }

    @Test
    @DisplayName("Preflight CORS OPTIONS with https://hamarashops.ai origin succeeds with 200 OK and matching CORS header")
    public void testPreflightCors_HamarashopsAiOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/industries")
                        .header("Origin", "https://hamarashops.ai")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Content-Type,Accept,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://hamarashops.ai"));
    }

    @Test
    @DisplayName("GET /api/v1/products returns product catalog successfully")
    public void testGetProducts() throws Exception {
        mockMvc.perform(get("/api/v1/products")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(jsonPath("$", hasSize(6)))
                .andExpect(jsonPath("$[0].slug", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/industries returns industry catalog successfully")
    public void testGetIndustries() throws Exception {
        mockMvc.perform(get("/api/v1/industries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));
    }

    @Test
    @DisplayName("GET /api/v1/careers returns career catalog successfully")
    public void testGetCareers() throws Exception {
        mockMvc.perform(get("/api/v1/careers"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/v1/contact returns contact info successfully")
    public void testGetContactInfo() throws Exception {
        mockMvc.perform(get("/api/v1/contact"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contactEmail", is("info@hamarashops.ai")));
    }

    @Test
    @DisplayName("GET /api/v1/assistant/context returns comprehensive context successfully")
    public void testGetAssistantContext() throws Exception {
        mockMvc.perform(get("/api/v1/assistant/context"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.company", notNullValue()))
                .andExpect(jsonPath("$.products", hasSize(6)));
    }

    @Test
    @DisplayName("GET /actuator/health returns UP status")
    public void testActuatorHealth() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("UP")));
    }

    @Test
    @DisplayName("POST /api/v1/contact/inquire with missing fields returns 400 Bad Request via GlobalExceptionHandler")
    public void testSubmitInquiryValidationFailure() throws Exception {
        mockMvc.perform(post("/api/v1/contact/inquire")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Bad Request")));
    }
}
