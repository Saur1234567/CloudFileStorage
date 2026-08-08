# ☁️ CloudFileStorage

> A Google Drive–style cloud file management platform built on a Spring Boot microservices architecture, with a modern React frontend.

CloudFileStorage lets users upload, organize, search, and manage files and folders — just like Google Drive — powered by a fully distributed backend of independently deployable microservices communicating through service discovery and API gateway routing.

---

## ✨ Features

- 📁 Upload, download, rename, move, and delete files & folders
- ⭐ Star and organize favorites
- 🗑️ Trash & restore support
- 🔍 Full-text search across files and folders
- 🔐 Secure authentication with JWT (access + refresh tokens)
- 📧 Email notifications (OTP verification, password reset)
- 📊 Real-time upload progress tracking
- 🌗 Responsive, modern UI with grid/list views

---

## 🏗️ Architecture

CloudFileStorage follows a **microservices architecture**, where each service owns a single responsibility and communicates via **Netflix Eureka** for service discovery and **OpenFeign** for inter-service REST calls. All external traffic flows through a single **Spring Cloud API Gateway**.

```
                         ┌─────────────────┐
                         │   React (Vite)   │
                         │     Frontend     │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │   API Gateway     │  :8080
                         └────────┬─────────┘
                                  │
        ┌──────────┬─────────────┼─────────────┬──────────┐
        │           │             │             │          │
   ┌────▼───┐  ┌────▼────┐  ┌─────▼────┐  ┌─────▼────┐ ┌───▼────┐
   │  Auth  │  │  User   │  │   File   │  │  Folder  │ │ Search │
   │Service │  │ Service │  │ Service  │  │ Service  │ │Service │
   └────────┘  └─────────┘  └──────────┘  └──────────┘ └────────┘
        │           │             │             │          │
        └───────────┴──────┬──────┴─────────────┴──────────┘
                            │
                  ┌─────────▼──────────┐
                  │   Eureka Server     │  Service Discovery
                  └─────────────────────┘

          ┌────────────────┐   ┌──────────────────┐
          │  Config Server  │   │Notification Svc   │
          └────────────────┘   └───────────────────┘
```

---

## 🧩 Microservices

| Service | Responsibility | Port |
|---|---|---|
| **Eureka Server** | Service registry & discovery | `8761` |
| **API Gateway** | Single entry point, routing, CORS | `8080` |
| **Config Server** | Centralized configuration | `8888` |
| **Auth Service** | JWT auth, registration, OTP, password reset | — |
| **User Service** | User profile management | — |
| **File Service** | File upload/download/storage | `8081` |
| **Folder Service** | Folder hierarchy management | — |
| **Search Service** | Cross-service search (Feign + fallback) | — |
| **Order Service** | Order management demo module | `8089` |
| **Notification Service** | Email/SMS notifications | `8085` |
| **Common Library** | Shared DTOs, exceptions, constants | — |

---

## 🛠️ Tech Stack

**Backend**
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Eureka](https://img.shields.io/badge/Netflix_Eureka-E50914?style=for-the-badge)
![OpenFeign](https://img.shields.io/badge/OpenFeign-6DB33F?style=for-the-badge)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**Database & Tools**
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven
- Node.js & npm
- MySQL (or H2 for local dev)

### Run the backend services (in order)
```bash
# 1. Start Eureka Server
cd Eureka && ./mvnw spring-boot:run

# 2. Start Config Server
cd config-server && ./mvnw spring-boot:run

# 3. Start API Gateway
cd api-gateway && ./mvnw spring-boot:run

# 4. Start remaining services (any order)
cd auth-service && ./mvnw spring-boot:run
cd user-service && ./mvnw spring-boot:run
cd File-Service && ./mvnw spring-boot:run
cd folder-service && ./mvnw spring-boot:run
cd search-service && ./mvnw spring-boot:run
cd notification-service && ./mvnw spring-boot:run
```

### Run the frontend
```bash
cd DriveUI/DriveUI
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, routed through the API Gateway at `http://localhost:8080`.

---

## 📌 Roadmap

- [ ] File sharing & permission management
- [ ] File versioning
- [ ] Real-time collaboration
- [ ] Dockerized deployment
- [ ] CI/CD pipeline

---

## 👤 Author

**Saurav Kumar**
Java Full Stack Developer | Spring Boot · React · Docker
📫 [LinkedIn](https://www.linkedin.com/in/saurav-kumar-560875284) · [LeetCode](https://leetcode.com/u/___saurav___244/)

---

⭐ If you find this project interesting, consider giving it a star!
