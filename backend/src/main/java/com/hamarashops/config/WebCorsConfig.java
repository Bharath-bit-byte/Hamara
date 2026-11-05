package com.hamarashops.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class WebCorsConfig implements WebMvcConfigurer {

    @Value("${FRONTEND_URL:https://hamarashops.com}")
    private String frontendUrl;

    private static final List<String> STATIC_ALLOWED_ORIGINS = Arrays.asList(
            "https://hamarashops.com",
            "https://www.hamarashops.com",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://localhost:3000"
    );

    private static final List<String> ALLOWED_ORIGIN_PATTERNS = Arrays.asList(
            "https://*.run.app",
            "https://*.hamarashops.com",
            "https://*.hamarashops.ai",
            "https://hamarashops.ai"
    );

    private static final List<String> ALLOWED_METHODS = Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"
    );

    private static final List<String> ALLOWED_HEADERS = Arrays.asList(
            "Content-Type", "Accept", "Authorization", "Origin", "X-Requested-With"
    );

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(getAllowedOriginsArray())
                .allowedOriginPatterns(ALLOWED_ORIGIN_PATTERNS.toArray(new String[0]))
                .allowedMethods(ALLOWED_METHODS.toArray(new String[0]))
                .allowedHeaders(ALLOWED_HEADERS.toArray(new String[0]))
                .allowCredentials(false)
                .maxAge(3600);
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistrationBean() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);

        for (String origin : getAllowedOriginsList()) {
            config.addAllowedOrigin(origin);
        }
        for (String pattern : ALLOWED_ORIGIN_PATTERNS) {
            config.addAllowedOriginPattern(pattern);
        }
        for (String method : ALLOWED_METHODS) {
            config.addAllowedMethod(method);
        }
        for (String header : ALLOWED_HEADERS) {
            config.addAllowedHeader(header);
        }

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    private List<String> getAllowedOriginsList() {
        List<String> origins = new java.util.ArrayList<>(STATIC_ALLOWED_ORIGINS);
        if (frontendUrl != null && !frontendUrl.trim().isEmpty() && !origins.contains(frontendUrl.trim())) {
            origins.add(frontendUrl.trim());
        }
        return origins;
    }

    private String[] getAllowedOriginsArray() {
        return getAllowedOriginsList().toArray(new String[0]);
    }
}
