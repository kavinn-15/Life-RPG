# ⚔️ Life-RPG — Gamified Personal Development Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.3.4%20%7C%20Java%2021-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Swagger](https://img.shields.io/badge/API%20Docs-Swagger%20%2F%20OpenAPI-85EA2D?style=flat-square&logo=swagger&logoColor=black)](http://localhost:8080/swagger-ui.html)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> **Life-RPG** is a full-stack gamified personal growth and habit-building web application that transforms your real-world tasks, habits, and discipline into an RPG adventure. Earn XP, level up attributes, maintain streaks, unlock achievements, customize your avatar, and redeem rewards in the virtual shop.

---

## 🌟 Key Features

### 🎯 Quest & Mission Management
- **Quests Hub**: Create, edit, track, and complete daily, weekly, and epic quests categorized by domains (Fitness, Career, Mindset, etc.).
- **Dynamic Rewards**: Earn gold and experience points (XP) dynamically upon completing objectives.
- **Persistent State**: Full synchronization between client state, local storage, and the Spring Boot REST backend.

### 🛡️ Character & Attribute Progression
- **Attribute Matrix**: 10 distinct RPG attributes (Coding, Logic, Physical Resilience, Focus, Discipline, etc.) mapped dynamically on an interactive Radar Chart.
- **Level Continuum**: Live XP bar with milestone tracking, rank tier updates, and leveling calculation.
- **Customizable Avatar**: Choose from 5 distinct vector character archetypes (Cyan, Rose, Teal, Amber, Crimson) or upload custom player portraits from your computer with live preview.

### 🔥 Streak Center & Proof-of-Work
- **Interactive Streak Calendar**: Visual 30-day tracking calendar highlighting completed vs active days.
- **Streak Multipliers**: Maintain daily momentum to unlock XP multipliers and consistency bonuses.
- **Proof-of-Work Feed**: Activity log displaying real-time task completions.

### 🏆 Achievements & Badges
- **Milestone Unlocks**: Unlock achievements based on total quests completed, level milestones, and stat thresholds.
- **Interactive Badges**: Visual rarity tiers (Bronze, Silver, Gold, Diamond) with instant reward claiming and persistent state sync.

### 🎁 Reward Shop & Inventory
- **Real-Life Rewards**: Create and redeem customized rewards (e.g., "Guilt-free Gaming Night", "Special Coffee") using hard-earned in-game gold.
- **Relics & Equipment**: Equip relics that boost XP gains and display character status.

### 📊 Analytics & Progress Tracking
- **Interactive Charts**: Powered by Recharts to visualize weekly XP velocity, domain allocations, and completion trends.
- **Activity Heatmap**: Real-time visualization of daily productivity patterns.

### 🔐 Authentication & Security
- **JWT Authentication**: Secure stateless token-based authorization.
- **Email OTP Verification**: Integrated with JavaMail for secure password resets and verification.
- **Role-based Access**: Clean separation of user context and guest/demo flows.

---

## 🏗️ Architecture & Tech Stack

```
Life-RPG/
├── life-rpg-frontend/       # Frontend Root
│   └── life-rpg/           # React + Vite application
│       ├── src/
│       │   ├── assets/     # Images, icons, and static assets
│       │   ├── components/ # Reusable UI components (Sidebar, Topbar, Modals, RadarChart, AvatarDisplay)
│       │   ├── data/       # Default schemas, quest data, and fallback datasets
│       │   ├── pages/      # Application views (Dashboard, Quests, Character, Streaks, Shop, etc.)
│       │   ├── services/   # REST API client & backend service integration layer
│       │   ├── state/      # Global React Context (GameContext, Auth)
│       │   └── utils/      # Formatting, calculations & helper functions
│       ├── package.json
│       └── vite.config.js
├── life-rpg-backend/       # Spring Boot 3.3.4 (Java 21) REST API
│   ├── src/main/java/com/liferpg/
│   │   ├── config/         # Security, JWT, CORS, and Web MVC configuration
│   │   ├── controller/     # REST API Controllers (Quest, Character, Auth, etc.)
│   │   ├── model/          # JPA Entities & Domain Models
│   │   ├── repository/     # Spring Data JPA repositories
│   │   ├── security/       # JWT Filters, UserDetailsService & Auth Providers
│   │   └── service/        # Business logic & email delivery services
│   ├── src/main/resources/ # application.properties, database configs
│   └── pom.xml
└── README.md
```

### 💻 Technologies Used
| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, TailwindCSS, Framer Motion, Recharts, Material Symbols |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, JavaMail Sender |
| **Security** | JSON Web Tokens (JJWT 0.12.6), BCrypt Password Hashing |
| **Database** | Embedded H2 (Zero-setup Dev) / MySQL 8.x (Production Ready), HikariCP Pool |
| **API Tooling** | SpringDoc OpenAPI 2.6.0, Swagger UI |

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Java Development Kit (JDK 21)](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-21)
- [Maven](https://maven.apache.org/) (or use the included Maven wrapper)
- [Git](https://git-scm.com/)

---

### 1️⃣ Setting Up & Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd life-rpg-backend
   ```

2. Build the application with Maven:
   ```bash
   mvn clean package -DskipTests
   ```

3. Run the Spring Boot application:
   ```bash
   java -jar target/life-rpg-backend-1.0.0.jar
   ```
   *Alternatively, run via Maven:*
   ```bash
   mvn spring-boot:run
   ```

4. Backend services will be live at:
   - **API Base URL**: `http://localhost:8080/api`
   - **Swagger API Explorer**: `http://localhost:8080/swagger-ui.html`
   - **OpenAPI JSON Docs**: `http://localhost:8080/api-docs`
   - **H2 Database Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:liferpg`)

---

### 2️⃣ Setting Up & Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd life-rpg-frontend/life-rpg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env` (optional, defaults to port 8080):
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   - **Web App**: `http://localhost:5173`

---

## 📡 REST API Overview

| Tag | Endpoint | Method | Description |
|---|---|---|---|
| **Auth** | `/api/auth/register` | `POST` | Register a new user profile |
| **Auth** | `/api/auth/login` | `POST` | Authenticate user & receive JWT token |
| **Auth** | `/api/auth/me` | `GET` | Retrieve currently authenticated user |
| **Quests** | `/api/quests` | `GET` | Get all user quests (with domain & status filters) |
| **Quests** | `/api/quests` | `POST` | Create a new custom quest |
| **Quests** | `/api/quests/{id}/complete`| `POST` | Complete quest and disburse XP/Gold rewards |
| **Quests** | `/api/quests/{id}` | `DELETE`| Delete an active quest |
| **Character** | `/api/character` | `GET` | Retrieve character stats, level, radar data |
| **Character** | `/api/character/attributes`| `PUT` | Update player attribute distributions |
| **Achievements** | `/api/achievements` | `GET` | List all milestones & completion statuses |
| **Daily Missions** | `/api/daily-missions` | `GET` | Retrieve today's daily assigned tasks |
| **Progress** | `/api/progress/summary` | `GET` | Fetch weekly analytics, completion rates & XP logs |
| **Rewards** | `/api/rewards` | `GET` | List custom shop rewards |
| **Rewards** | `/api/rewards/{id}/redeem` | `POST` | Spend gold to claim a reward |

---

## ⚙️ Configuration & Environment

### Backend `application.properties` Options:
```properties
# Server
server.port=8080

# Database Configuration (Switch to MySQL by providing environment variables)
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:h2:mem:liferpg;DB_CLOSE_DELAY=-1}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:sa}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:}

# JWT Configuration
jwt.secret=${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
jwt.expiration=86400000

# CORS
frontend.url=http://localhost:5173

# JavaMail for OTP Verification
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

---

## 🛡️ Best Practices & Architecture Highlights

- **Resilient Fallback Mode**: The frontend is built with an intelligent dual-mode architecture that connects to the live Spring Boot REST API when available, with automatic fallback and local storage synchronization to preserve player progress seamlessly.
- **Responsive & Modern Design**: Crafted with an RPG-inspired visual theme featuring custom glassmorphism, responsive cards, interactive micro-animations, and full mobile optimization.
- **Production Performance**: Response compression enabled on backend, high-speed Hikari connection pooling, and optimized Vite build chunks.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
