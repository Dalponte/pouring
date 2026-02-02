# Pouring (Bera Beer) 🍺

A modern IoT-based Beer Management System designed for real-time monitoring and control of beer taps. The project uses a distributed architecture to handle telemetry, operations, and data visualization.

## 🚀 Overview

Pouring is a comprehensive platform that connects physical beer taps (or simulators) to a central management system. It leverages **MQTT** for low-latency communication with hardware, **NestJS** for robust backend logic, and a **React-based Dashboard** for operator control.

### Key Features
- **Real-time Telemetry:** Monitor pour volumes, flow rates, and tap status via MQTT.
- **GraphQL API:** Modern, type-safe API for data fetching and real-time subscriptions.
- **Interactive Dashboard:** Beautifully designed web interface for managing taps and viewing metrics.
- **Job Processing:** Distributed task handling using BullMQ and Redis.
- **Scalable Architecture:** Built as a monorepo for shared code and seamless development.

---

## 🛠 Tech Stack

- **Backend:** [NestJS](https://nestjs.com/), [GraphQL](https://graphql.org/), [Prisma](https://www.prisma.io/) (ORM), [BullMQ](https://docs.bullmq.io/).
- **Frontend:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [XState](https://xstate.js.org/).
- **Communication:** [MQTT (Mosquitto)](https://mosquitto.org/), [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).
- **Database/Cache:** [PostgreSQL](https://www.postgresql.org/), [Redis](https://redis.io/).
- **DevOps:** Docker Compose, Makefile.

---

## 📂 Project Structure

```text
├── apps/
│   ├── backend/      # NestJS application (Core Business Logic, GraphQL, MQTT)
│   ├── dashboard/    # React/Vite web application (Management UI)
│   ├── mqtt/         # MQTT Broker configurations (Mosquitto)
│   └── poc/          # Proof of Concept / Experimental scripts
├── packages/
│   └── shared-utils/ # Utilities and types shared between apps
├── Makefile          # Project orchestration commands
└── docker-compose.yml # Infrastructure services (DB, Redis, MQTT)
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### 1. Installation
Install dependencies for the entire workspace:
```bash
pnpm install
```

### 2. Infrastructure Setup
Initialize the MQTT broker directories and start the core services:
```bash
make setup-mqtt
make up
```
This will start:
- **PostgreSQL** (Port 5432)
- **Redis** (Port 6379)
- **MQTT Broker** (Ports 1883, 9001)
- **Bull Board** (Port 3020) - Queue monitor

### 3. Database Initialization
Run migrations to set up your PostgreSQL schema:
```bash
make db-migrate
```

### 4. Running the Applications
Start the backend and dashboard in development mode:

**Backend:**
```bash
make backend
```

**Dashboard:**
```bash
make dashboard
```

---

## 🔧 Development Workflow

The project includes a `Makefile` to simplify common tasks:

- `make up`: Start infrastructure (Docker).
- `make down`: Stop infrastructure (Docker).
- `make db-migrate`: Run Prisma migrations.
- `make db-reset`: Reset the database.
- `make logs`: View Docker logs.
- `make help`: List all available commands.

---

## 📊 Monitoring
- **Queue Management:** Visit [http://localhost:3020](http://localhost:3020) to access Bull Board.
- **Database Studio:** Run `pnpm --filter backend prisma studio` to explore and edit data.

---

## 📝 License
This project is licensed under the [ISC License](LICENSE).
