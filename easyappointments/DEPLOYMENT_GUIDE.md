# Easy!Appointments Deployment & Configuration Guide

This guide provides end-to-end instructions for deploying **Easy!Appointments** as an independent, serverless scheduling service on **Google Cloud Run** with **Google Cloud SQL for MySQL** and **Google Secret Manager**, and linking it with **HamaraShops.ai** via redirect-based booking.

---

## Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                        HamaraShops.ai React SPA Frontend                          |
|                  User clicks "Schedule an Appointment" button                      |
+-----------------------------------------+-----------------------------------------+
                                          |
                        window.location.assign(VITE_BOOKING_URL)
                                          v
+-----------------------------------------------------------------------------------+
|                     Easy!Appointments on Google Cloud Run                         |
|                    Custom Subdomain: booking.yourdomain.com                       |
|                                                                                   |
|  - Customer selects Service (e.g., AI Solutions Consultation, 30 min)             |
|  - Customer selects Date & Available Time Slot                                    |
|  - Customer enters Name, Email, Phone & Notes                                     |
|  - Booking Confirmation displayed to customer                                     |
+--------------------+--------------------------------------+-----------------------+
                     |                                      |
       Cloud SQL Unix Socket                       SMTP over TLS (587)
                     v                                      v
+-----------------------------------------+ +---------------------------------------+
|        Google Cloud SQL (MySQL 8)       | |        Resend Transactional Email     |
|  - Persistent storage across revisions  | |  - Customer confirmation email        |
|  - ea_appointments, ea_services, etc.  | |  - Administrator alert email          |
+-----------------------------------------+ +---------------------------------------+
```

---

## 1. Google Cloud Prerequisites

Ensure the following APIs are enabled in your Google Cloud Project:
```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

---

## 2. Google Cloud SQL (MySQL) Setup

Easy!Appointments requires a persistent relational database. For production on Google Cloud, use **Cloud SQL for MySQL**.

### A. Create Cloud SQL Instance
```bash
gcloud sql instances create hamarashops-mysql \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=asia-south1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --storage-auto-increase \
  --backup-start-time=02:00
```

### B. Create Database & User
```bash
# Create the database
gcloud sql databases create easyappointments --instance=hamarashops-mysql

# Generate a strong password and create the user
gcloud sql users create ea_user \
  --instance=hamarashops-mysql \
  --password="REPLACE_WITH_STRONG_PASSWORD"
```

### C. Note the Connection Name
Retrieve the instance connection name:
```bash
gcloud sql instances describe hamarashops-mysql --format="value(connectionName)"
# Output format: PROJECT_ID:asia-south1:hamarashops-mysql
```

---

## 3. Google Secret Manager Setup

Store sensitive credentials securely in Google Secret Manager rather than in plain-text environment variables.

### A. Create Database Password Secret
```bash
# Create the secret
gcloud secrets create easyappointments-db-password --replication-policy="automatic"

# Add the password version
echo -n "REPLACE_WITH_STRONG_PASSWORD" | gcloud secrets versions add easyappointments-db-password --data-file=-
```

### B. Create Resend API Key Secret (if not already created)
```bash
gcloud secrets create resend-api-key --replication-policy="automatic"
echo -n "re_YOUR_RESEND_API_KEY" | gcloud secrets versions add resend-api-key --data-file=-
```

### C. Grant Cloud Run Access to Secrets
Find the default compute service account or dedicated runtime service account:
```bash
PROJECT_NUM=$(gcloud projects describe $(gcloud config get-value project) --format="value(projectNumber)")
SA_EMAIL="${PROJECT_NUM}-compute@developer.gserviceaccount.com"

# Grant Secret Accessor role
gcloud secrets add-iam-policy-binding easyappointments-db-password \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding resend-api-key \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 4. Build & Push Easy!Appointments Container

Create an Artifact Registry Docker repository (if not already present):
```bash
gcloud artifacts repositories create hamarashops-repo \
  --repository-format=docker \
  --location=asia-south1 \
  --description="HamaraShops Docker Repository"
```

Build and submit the Easy!Appointments image from the `easyappointments/` folder:
```bash
PROJECT_ID=$(gcloud config get-value project)

gcloud builds submit --tag asia-south1-docker.pkg.dev/${PROJECT_ID}/hamarashops-repo/easyappointments:latest ./easyappointments
```

---

## 5. Deploy Easy!Appointments to Google Cloud Run

Deploy the service, attaching the Cloud SQL connection and Secret Manager values:

```bash
PROJECT_ID=$(gcloud config get-value project)
CONNECTION_NAME="${PROJECT_ID}:asia-south1:hamarashops-mysql"

gcloud run deploy easyappointments \
  --image asia-south1-docker.pkg.dev/${PROJECT_ID}/hamarashops-repo/easyappointments:latest \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080 \
  --add-cloudsql-instances=${CONNECTION_NAME} \
  --set-env-vars="DB_HOST=localhost:/cloudsql/${CONNECTION_NAME},DB_NAME=easyappointments,DB_USERNAME=ea_user,BASE_URL=https://easyappointments-${PROJECT_NUM}.asia-south1.run.app,LANGUAGE=english,DEBUG_MODE=FALSE,PROXY_IPS=*,MAIL_PROTOCOL=smtp,MAIL_SMTP_HOST=smtp.resend.com,MAIL_SMTP_PORT=587,MAIL_SMTP_USER=resend,MAIL_SMTP_CRYPTO=tls,MAIL_SMTP_AUTH=1,MAIL_FROM_ADDRESS=onboarding@resend.dev,MAIL_FROM_NAME=HamaraShops.ai Business Consultations,MAIL_REPLY_TO_ADDRESS=info@hamarashops.ai" \
  --set-secrets="DB_PASSWORD=easyappointments-db-password:latest,MAIL_SMTP_PASS=resend-api-key:latest"
```

After deployment, copy the output service URL:
`https://easyappointments-xxxxxxxx-el.a.run.app`

---

## 6. Custom Domain / Subdomain Setup (Optional)

To map a dedicated booking subdomain like `booking.yourdomain.com`:

```bash
gcloud beta run domain-mappings create \
  --service easyappointments \
  --domain booking.yourdomain.com \
  --region asia-south1
```
Add the provided DNS resource records (CNAME / TXT) at your domain registrar.
Once verified, update `BASE_URL` on Cloud Run:
```bash
gcloud run services update easyappointments \
  --region asia-south1 \
  --update-env-vars BASE_URL=https://booking.yourdomain.com
```

---

## 7. Initial Web Installation Wizard

1. Open the deployed URL in your browser:
   `https://booking.yourdomain.com/index.php/installation`
2. Follow the setup wizard:
   - **Admin Username**: e.g., `admin`
   - **Admin Password**: Choose a strong, complex passphrase.
   - **Admin Email**: e.g., `info@hamarashops.ai`
   - **Company / Business Name**: `HamaraShops.ai`
   - **Company Email**: `info@hamarashops.ai`
3. Click **Install**. Easy!Appointments will initialize all required MySQL tables and log you in.

---

## 8. Configure Business Consultation Services

Log in to the Admin Dashboard (`/index.php/backend`) to set up services and working hours:

### A. Create Consultation Services
Navigate to **Services** in the dashboard and create the 5 consultation offerings:

1. **General Business Consultation**:
   - Duration: 30 minutes
   - Price: 0.00 (Complimentary)
   - Description: "Initial discovery consultation to explore business requirements, platform capabilities, and strategic alignment."
2. **AI Solutions Consultation**:
   - Duration: 30 minutes
   - Price: 0.00
   - Description: "Deep-dive session on generative AI architectures, LLM orchestration, vector search, and model deployment."
3. **Website and E-commerce Consultation**:
   - Duration: 30 minutes
   - Price: 0.00
   - Description: "Modern web architecture review, React SPA design, headless commerce, and high-performance storefront scaling."
4. **Digital Transformation Consultation**:
   - Duration: 30 minutes
   - Price: 0.00
   - Description: "Roadmapping legacy modernization, cloud migration to GCP, workflow automation, and organizational AI readiness."
5. **Custom Software Development Consultation**:
   - Duration: 30 minutes
   - Price: 0.00
   - Description: "Scoping custom full-stack solutions, Spring Boot enterprise backends, secure APIs, and bespoke AI applications."

### B. Configure Working Hours & Availability
Navigate to **Providers / Working Plan**:
- **Time Zone**: Select `Asia/Kolkata` (India Standard Time).
- **Working Days**: Monday through Friday (or your business days).
- **Working Hours**: e.g., `10:00 AM – 06:00 PM`.
- **Buffer Time**: 15 minutes between appointments.

---

## 9. Linking with React Frontend

In `frontend/.env.production` (or your build pipeline environment):
```env
VITE_BOOKING_URL=https://booking.yourdomain.com
```
Rebuild and redeploy the frontend:
```bash
npm run build
```
Customers clicking **"Schedule an Appointment"** on `HamaraShops.ai` will be redirected smoothly to `https://booking.yourdomain.com` to choose their service, date, and time slot!
