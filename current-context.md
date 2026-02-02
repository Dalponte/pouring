# Current Context: Pouring (Bera Beer) 🍺

This document provides a technical overview of the system architecture, design patterns, and development standards. It serves as a guideline for future refactoring and agent-based development.

## 🏗 System Architecture

The project follows a **Distributed Monorepo** architecture managed by `pnpm`.

### 1. High-Level Components
- **Backend (`apps/backend`)**: NestJS core acting as the central hub. It orchestrates communication between hardware (MQTT), database (PostgreSQL), and the UI (GraphQL).
- **Dashboard (`apps/dashboard`)**: A modern React-based management interface for real-time observability and control.
- **Infrastructure**: Dockerized PostgreSQL, Redis, and Mosquitto (MQTT Broker).
- **Shared Utils (`packages/shared-utils`)**: Shared types, constants, and logic used across the monorepo.

### 2. Communication Flow
- **Hardware -> Backend**: Via **MQTT**. Telemetry data is published to topics and consumed by the NestJS MQTT module.
- **Backend -> Hardware**: Commands are published to MQTT topics.
- **Backend <-> Dashboard**: **GraphQL** for standard queries/mutations and **WebSockets (GraphQL Subscriptions)** for real-time updates.
- **Async Processing**: **BullMQ (Redis)** handles heavy operations and background tasks.

---

## 🎨 Design Patterns

### Backend (NestJS)
- **Modular Architecture**: Functionality is encapsulated into domain modules (e.g., `TapModule`, `DispenseModule`).
- **Adapter/Infrastructure Pattern**: External services (MQTT, BullMQ, Prisma) are isolated into "Infrastructure Modules" to decouple domain logic from specific implementations.
- **Event-Driven Patterns**: 
    - **Internal**: `EventEmitter2` is used for loosely coupled communication between modules (e.g., `DispenseCreated` event).
    - **External**: MQTT for hardware events.
- **Repository/Service Pattern**: Services handle business logic while Prisma manages data persistence.
- **DTOs (Data Transfer Objects)**: Strict typing for all inputs and outputs using `class-validator` and `class-transformer`.

### Frontend (React)
- **State Machines (XState)**: Used for managing complex component lifecycles and business flows (e.g., machine operation states).
- **Hooks-based Data Fetching**: Encapsulation of Apollo Client logic into custom hooks (e.g., `useTaps`) for clean component code.
- **Atomic Design Principles**: Reusable UI components located in `components/ui`.
- **Observer Pattern**: Real-time UI updates via GraphQL Subscriptions.

---

## 🛠 Development Standards

### 1. Code Quality
- **Type Safety**: TypeScript is mandatory across the entire stack.
- **GraphQL**: Code-first approach. All schema changes must be driven by NestJS decorators.
- **Database**: Prisma is the source of truth for the schema. Use `make db-migrate` for all changes.

### 2. Orchestration
- **Makefile**: The primary entry point for all development tasks (Docker, Migrations, App execution).
- **Docker**: Infrastructure must be reproducible. Never run local DBs/Redis instances; use `make up`.

### 3. Git Workflow
- **Git Flow**: The project is set up for Git Flow (`master`, `develop`, `feature/*`, `release/*`, `hotfix/*`).
- **Direct Commits**: Avoid direct commits to `master` in production environments (currently allowed for POC/Dev).

---

## 🔍 Refactoring Guidelines (Future)
- **Shared Package Expansion**: Move more shared interfaces from domain modules to `packages/shared-utils` to avoid circular dependencies.
- **Service Decoupling**: Ensure `MqttModule` and `QueueModule` remain passive adapters without business logic.
- **Testing**: Prioritize E2E tests for GraphQL resolvers and unit tests for domain services.
- **Dashboard Scalability**: Decouple business logic from UI components using more XState machines and context providers.
