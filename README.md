# Customer Support Ticketing System

A microservices-based customer support platform built with Node.js, MongoDB, RabbitMQ, Docker, and Kubernetes.

---

## Architecture Overview

The system is split into 6 independent services:

| Service | Port | Responsibility |
|---|---|---|
| user-service | 4000 | Registration, login, JWT auth |
| ticket-service | 3003 | Create and manage tickets |
| support-service | 3002 | Assign agents, resolve tickets |
| notification-service | 3001 | RabbitMQ consumer, saves notifications |
| reporting-service | 3005 | Ticket analytics and reports |
| frontend | 8080 | React UI served via Nginx |

**Infrastructure:**
- MongoDB — one container, 5 separate databases (one per service)
- RabbitMQ — async messaging between services
- Nginx — reverse proxy inside the frontend container

**Communication:**
- Sync (HTTP): frontend → backend services via Nginx proxy
- Async (RabbitMQ): ticket-service and support-service publish events → notification-service and reporting-service consume them

---

## Prerequisites

### Windows
- Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- Enable WSL2 when prompted during installation
- After install, open Docker Desktop and make sure it is running

### macOS
- Install [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- Open Docker Desktop and make sure it is running

### Linux
- Install Docker Engine and Docker Compose plugin
```bash
sudo apt update
sudo apt install docker.io docker-compose-plugin -y
sudo usermod -aG docker $USER
# log out and back in after this
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:Habiba-Adel/Customer-Support-Ticketing-System.git
cd Customer-Support-Ticketing-System
git checkout monorepo
```

### 2. Create your environment file

```bash
cp .env.example .env
```

The `.env` file already has working default values — no changes needed for local development.

### 3. Run the development environment

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

First run takes 5-10 minutes to download all images. Subsequent runs are faster.

### 4. Verify everything is running

Open a new terminal and run:

```bash
docker ps
```

You should see these containers all with status `Up`:
- mongodb
- rabbitmq
- user-service
- ticket-service
- support-service
- notification-service
- reporting-service
- frontend

---

## Access Points

| URL | What it is |
|---|---|
| http://localhost:8080 | Main application UI |
| http://localhost:15672 | RabbitMQ management UI (admin / admin123) |
| http://localhost:27017 | MongoDB (connect via MongoDB Compass) |
| http://localhost:4000 | User service API |
| http://localhost:3003 | Ticket service API |
| http://localhost:3002 | Support service API |
| http://localhost:3001 | Notification service API |
| http://localhost:3005 | Reporting service API |

---

## Test Accounts

Create test accounts using these curl commands (or use Postman):

```bash
# Create a customer account
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Customer","email":"customer@test.com","password":"123456","role":"customer"}'

# Create an agent account
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Agent","email":"agent@test.com","password":"123456","role":"agent"}'
```

Then login at http://localhost:8080 with either account.

---

## API Reference

### User Service (port 4000)

```
POST /api/users/register    body: { name, email, password, role }
POST /api/users/login       body: { email, password }  → returns { token, user }
GET  /api/users/:id         returns user by ID
```

### Ticket Service (port 3003)
All routes require Authorization header: `Bearer <token>`

```
POST /api/tickets           body: { title, description }  (customer only)
GET  /api/tickets           returns tickets (customer sees own, agent sees assigned)
GET  /api/tickets/unassigned  returns unassigned tickets (agent only)
GET  /api/tickets/:id       returns single ticket
```

### Support Service (port 3002)
```
POST /api/support/assign          body: { ticketId, agentId }
POST /api/support/respond         body: { ticketId, sender, message }
GET  /api/support/:ticketId       returns support record for ticket
PUT  /api/support/resolve/:ticketId
PUT  /api/support/close/:ticketId
PUT  /api/support/reopen/:ticketId
```

### Notification Service (port 3001)
```
GET    /api/notifications/:userId
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all/:userId
GET    /api/notifications/unread-count/:userId
DELETE /api/notifications/:id
DELETE /api/notifications/clear-all/:userId
```

### Reporting Service (port 3005)
```
GET /api/reports/total-tickets
GET /api/reports/status-counts
GET /api/reports/priority-counts
GET /api/reports/average-resolution
GET /api/reports/agent-performance
```

---

## Environment Variables

Each service reads these from Docker Compose — you do not need to set them manually. They are defined in `docker-compose.yml` and `.env`.

| Variable | Used by | Description |
|---|---|---|
| MONGODB_URI | all services | MongoDB connection string |
| RABBITMQ_URL | ticket, support, notification, reporting | RabbitMQ connection |
| JWT_SECRET | user, ticket | Token signing secret |
| PORT | all services | Service port |

---

## Making Code Changes

### If you change a service's code:

```bash
# rebuild and restart only that service
docker compose -f docker-compose.yml -f docker-compose.dev.yml up <service-name> --build

# examples:
docker compose -f docker-compose.yml -f docker-compose.dev.yml up ticket-service --build
docker compose -f docker-compose.yml -f docker-compose.dev.yml up frontend --build
```

### If you change docker-compose files:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### To stop everything:

```bash
docker compose down
```

### To stop and delete all data (fresh start):

```bash
docker compose down -v
```

---

## Running Different Environments

### Development (with hot reload and exposed ports)
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### Testing (separate databases, different ports)
```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml up --build
```

### Production (no volume mounts, restart policies)
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Kubernetes Deployment (minikube)

### Prerequisites
- Install kubectl and minikube
- Start minikube: `minikube start --driver=docker`

### Deploy everything
```bash
chmod +x k8s/deploy.sh
bash k8s/deploy.sh
```

### Check status
```bash
kubectl get pods
kubectl get services
```

### Access the application
```bash
minikube ip
# open http://<minikube-ip>:30080
```

### Tear down
```bash
kubectl delete -f k8s/
```

---

## Project Structure

```
customer-support-system/
├── docker-compose.yml          # base compose file
├── docker-compose.dev.yml      # development overrides
├── docker-compose.test.yml     # test overrides
├── docker-compose.prod.yml     # production overrides
├── .env                        # your local env (never commit this)
├── .env.example                # template for env variables
├── ticket-service/
├── support-service/
├── user-service/
├── notification-service/
├── reporting-service/
├── frontend/
│   └── nginx.conf              # reverse proxy config
├── k8s/                        # Kubernetes manifests
│   ├── deploy.sh               # one-command deployment script
│   ├── secret.yml
│   ├── hpa.yml
│   ├── ingress.yml
│   ├── mongodb/
│   ├── rabbitmq/
│   ├── user-service/
│   ├── ticket-service/
│   ├── support-service/
│   ├── notification-service/
│   ├── reporting-service/
│   └── frontend/

```

---

## Common Issues

**Containers keep restarting:**
```bash
docker compose logs <service-name>
```
Check the logs for the specific error.

**MongoDB URI undefined error:**
Make sure `.env` file exists at the project root. Copy from `.env.example` if missing.

**Port already in use:**
Another application is using one of the ports. Either stop that app or change the port in `docker-compose.dev.yml`.

**RabbitMQ connection refused:**
Services start before RabbitMQ is ready. Run `docker compose restart <service-name>` to retry.

**Frontend shows old code after changes:**
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up frontend --build
```
The `--build` flag forces a rebuild of the image.