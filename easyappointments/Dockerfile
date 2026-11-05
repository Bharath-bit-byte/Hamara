# =============================================================================
# HamaraShops.ai - Easy!Appointments Cloud Run Production Container
# Base: Official Easy!Appointments Docker Image (alextselegidis/easyappointments)
# Target Runtime: Google Cloud Run (Serverless, Containerized, Scalable)
# =============================================================================

FROM alextselegidis/easyappointments:latest

# Cloud Run injects $PORT (default 8080). Configure Apache to dynamically listen
# on the provided $PORT instead of the default port 80.
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf && \
    sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g' /etc/apache2/sites-available/000-default.conf

# Enable Apache headers module for reverse proxy and SSL offloading support
RUN a2enmod headers rewrite

# Copy localized source code with Resend email configuration and customizations
COPY src/ /var/www/html/

# Ensure storage and cache directories have correct web server permissions
RUN chown -R www-data:www-data /var/www/html/storage \
    && chmod -R 775 /var/www/html/storage

# Default runtime environment variables for Cloud Run
ENV PORT=8080
ENV BASE_URL=http://localhost:8080
ENV LANGUAGE=english
ENV DEBUG_MODE=FALSE
ENV PROXY_IPS=*

# Cloud Run expects the container to listen on PORT
EXPOSE 8080
