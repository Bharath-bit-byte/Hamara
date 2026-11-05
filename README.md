# HamaraShops.ai — Enterprise Platform (Monolithic Architecture)

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg?style=flat-square&logo=openjdk)](https://adoptium.net/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Google Cloud Run](https://img.shields.io/badge/GCP-Cloud%20Run-4285F4.svg?style=flat-square&logo=googlecloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**HamaraShops.ai** is an enterprise-grade full-stack platform featuring a unified **Java 21 Spring Boot Monolithic Backend** and a high-performance **React 19 Single Page Application (SPA)** frontend. The backend consolidates content, business capabilities, customer inquiries, and conversational AI assistant context into a cohesive, modular monolithic application engineered for deployment on Google Cloud Run.

---

## 🏗 System Architecture

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|                                                                                   |
|      +--------------------------------------------------------------------+       |
|      |                        React 19 SPA Frontend                       |       |
|      |         Vite 5.4 | Tailwind CSS | Framer Motion | Three.js         |       |
|      +----------------------------------+---------------------------------+       |
+-----------------------------------------|-----------------------------------------+
                                          | HTTP / JSON REST
                                          | Base URL: http://localhost:8080/api/v1
                                          v
+-----------------------------------------------------------------------------------+
|                           SPRING BOOT MONOLITHIC BACKEND                          |
|                               (Port 8080 / $PORT)                                 |
|                                                                                   |
|   +-------------------+  +--------------------+  +----------------------------+   |
|   |  Content Module   |  |  Business Module   |  |       Contact Module       |   |
|   |  Products         |  |  Industries        |  |  Inquiries & Leads         |   |
|   |  Solutions        |  |  Careers           |  |  Appointments              |   |
|   |  Services         |  +--------------------+  |  Resend Email Integration  |   |
|   |  Insights         |                          +----------------------------+   |
|   |  Company Info     |  +--------------------+  +----------------------------+   |
|   |  Partners         |  |  Security & CORS   |  |   AI Assistant Engine      |   |
|   |  Testimonials     |  |  Preflight Filters |  |   Context Aggregator       |   |
|   |  Unified Search   |  |  Security Headers  |  |   Dynamic Suggestions      |   |
|   +-------------------+  +--------------------+  +----------------------------+   |
|                                                                                   |
|                          JSON In-Memory Dataset Store                             |
|          13 Classpath Resources (Products, Solutions, Industries, etc.)           |
+-----------------------------------------------------------------------------------+
```

---

## ✨ Architectural Highlights

- **Single Ingress & Unified Backend**: Replaced multiple microservices and Spring Cloud Gateway with a single high-performance Spring Boot monolithic service.
- **Direct Service Execution**: Eliminates network latency, inter-service HTTP hops, serialization overhead, and gateway route matching.
- **Preserved API Contracts**: All original `/api/v1/**` endpoints are maintained with 100% fidelity, ensuring zero breakage for the React frontend.
- **Unified CORS & Security**: Centralized `CorsFilter` and `WebMvcConfigurer` supporting local development, production domains (`hamarashops.com`, `hamarashops.ai`), and Cloud Run wildcard patterns (`*.run.app`).
- **Resend Email Integration**: Stateless transactional email dispatch via standard Java 21 `HttpClient` with environment-variable-driven secret management (`RESEND_API_KEY`).
- **Cloud Run Native**: Pre-configured with `${PORT:8080}`, multi-stage Docker containerization, and Knative deployment manifest (`cloud.yml`).

---

## 📁 Repository Directory Structure

```
HamaraShops-AI-main/
├── backend/                       # Single Monolithic Spring Boot Application
│   ├── pom.xml                    # Unified Maven Build File (Java 21, Spring Boot 4.1.0)
│   ├── Dockerfile                 # Multi-stage production container build (Temurin 21 JRE)
│   ├── cloud.yml                  # Google Cloud Run deployment specification
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hamarashops/
│   │   │   │   ├── HamaraShopsApplication.java  # Main application entry point
│   │   │   │   ├── business/                    # Industries & Careers domain
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── service/
│   │   │   │   │   └── model/
│   │   │   │   ├── contact/                     # Leads, Appointments & Email domain
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── service/
│   │   │   │   │   └── model/
│   │   │   │   ├── content/                     # Catalog, Solutions & Search domain
│   │   │   │   │   ├── controller/
│   │   │   │   │   ├── service/
│   │   │   │   │   └── model/
│   │   │   │   ├── config/                      # CORS, ObjectMapper & Web configuration
│   │   │   │   ├── security/                    # Security filters & header controls
│   │   │   │   └── exception/                   # Unified GlobalExceptionHandler
│   │   │   └── resources/
│   │   │       ├── application.yml              # Base configuration
│   │   │       ├── application-local.yml        # Local development profile
│   │   │       ├── application-cloud.yml        # Cloud Run production profile
│   │   │       └── data/                        # 13 JSON datasets (products, etc.)
│   │   └── test/
│   │       └── java/com/hamarashops/            # 28 Comprehensive automated tests
│   └── target/                                  # Compiled artifacts & executable JAR
├── frontend/                      # React 19 + Vite Single Page Application
│   ├── package.json               # Frontend dependencies & scripts
│   ├── Dockerfile                 # Multi-stage Nginx container build
│   ├── nginx.conf                 # Nginx production routing configuration
│   ├── src/                       # React components, pages, and services
│   └── dist/                      # Production build assets
├── microservices_legacy_backup.zip# Backup archive of legacy microservices
├── MONOLITHIC_MIGRATION_REPORT.md # Comprehensive migration architecture report
└── README.md                      # Project documentation
```

---

## 🚦 API Endpoints Reference

All endpoints are hosted directly on the monolithic backend at `http://localhost:8080/api/v1`:

| Domain | HTTP Method | Endpoint Path | Description |
| :--- | :---: | :--- | :--- |
| **Content** | `GET` | `/api/v1/products` | Returns all AI product offerings |
| **Content** | `GET` | `/api/v1/products/{slug}` | Returns product details by ID or slug |
| **Content** | `GET` | `/api/v1/solutions` | Returns industry solutions blueprints |
| **Content** | `GET` | `/api/v1/solutions/{slug}` | Returns solution details by ID or slug |
| **Content** | `GET` | `/api/v1/services` | Returns consulting and delivery services |
| **Content** | `GET` | `/api/v1/services/{slug}` | Returns service details by ID or slug |
| **Content** | `GET` | `/api/v1/insights` | Returns industry insights and research articles |
| **Content** | `GET` | `/api/v1/company` | Returns company overview, mission, and stats |
| **Content** | `GET` | `/api/v1/partners` | Returns technology ecosystem partners |
| **Content** | `GET` | `/api/v1/testimonials` | Returns customer testimonials |
| **Content** | `GET` | `/api/v1/integrations` | Returns third-party platform integrations |
| **Content** | `GET` | `/api/v1/case-studies` | Returns customer case studies |
| **Content** | `GET` | `/api/v1/metrics` | Returns enterprise benchmark metrics |
| **Content** | `GET` | `/api/v1/search?q={query}` | Performs full-text search across content catalog |
| **Assistant** | `GET` | `/api/v1/assistant/context` | Aggregated knowledge base context for AI assistant |
| **Assistant** | `GET` | `/api/v1/assistant/suggestions`| Dynamic prompt suggestions for chatbot |
| **Business**| `GET` | `/api/v1/industries` | Returns all industry vertical solutions |
| **Business**| `GET` | `/api/v1/industries/{slug}` | Returns industry details by ID or slug |
| **Business**| `GET` | `/api/v1/careers` | Returns open career positions |
| **Business**| `GET` | `/api/v1/careers/{id}` | Returns career details by ID or slug |
| **Contact** | `GET` | `/api/v1/contact` | Returns official contact metadata |
| **Contact** | `POST`| `/api/v1/contact/inquire` | Submits inquiry form & dispatches email notification |
| **Contact** | `POST`| `/api/v1/contact/appointment`| Schedules consultation & dispatches confirmation email |
| **Actuator**| `GET` | `/actuator/health` | Health probe status (`UP`) |

---

## 💻 Local Development Quickstart

### Prerequisites
- **JDK 21** or later installed
- **Apache Maven 3.9+** installed
- **Node.js 20+** and **npm 10+** installed

### 1. Start the Monolithic Backend
```bash
cd backend
mvn spring-boot:run
```
*Backend runs at `http://localhost:8080`*

### 2. Start the React Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 🧪 Testing and Verification

### Backend Tests (28 Automated Tests)
```bash
cd backend
mvn clean test
```
- **11 Unit Tests**: `ResendEmailServiceTest` validating email header sanitization and dispatch.
- **4 Integration Tests**: `AssistantKnowledgeTest` validating JSON dataset memory loading.
- **1 Context Test**: `HamaraShopsApplicationTests` validating application boot.
- **12 End-to-End Tests**: `HamaraShopsCorsAndEndpointsTest` validating CORS preflights, error handling, and endpoints across all domains.

### Build Executable Production JAR
```bash
cd backend
mvn clean package -DskipTests
# Executable JAR generated at: backend/target/hamarashops-backend-0.0.1-SNAPSHOT.jar
java -jar target/hamarashops-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build
```bash
cd frontend
npm run build
```

---

## 🐳 Docker & Google Cloud Run Deployment

### 1. Build Backend Docker Image Locally
```bash
docker build -t hamarashops/backend:latest ./backend
```

### 2. Run Backend Container Locally
```bash
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=local hamarashops/backend:latest
```

### 3. Deploy to Google Cloud Run
```bash
# Authenticate with Google Cloud
gcloud auth configure-docker <REGION>-docker.pkg.dev

# Build & Push via Cloud Build
gcloud builds submit --tag <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPO>/hamarashops-backend:latest ./backend

# Deploy to Cloud Run
gcloud run deploy hamarashops-backend \
  --image <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPO>/hamarashops-backend:latest \
  --platform managed \
  --region <REGION> \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars SPRING_PROFILES_ACTIVE=cloud,NOTIFICATION_TO_EMAIL=info@hamarashops.ai,CONTACT_FROM_EMAIL=onboarding@resend.dev \
  --update-secrets RESEND_API_KEY=resend-api-key:latest
```

---

## 📜 Migration Details

For full architectural details, package mappings, dependency comparisons, and testing reports, refer to [MONOLITHIC_MIGRATION_REPORT.md](MONOLITHIC_MIGRATION_REPORT.md).
