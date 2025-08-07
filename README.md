# 🚀 Aran API Sentinel

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PocketBase](https://img.shields.io/badge/PocketBase-B3D98F?style=for-the-badge&logo=pocketbase&logoColor=black)](https://pocketbase.io/)
[![Genkit](https://img.shields.io/badge/Genkit-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://firebase.google.com/docs/genkit)

Aran API Sentinel is a multi-tenant API security and governance platform designed to provide comprehensive visibility, control, and protection for your APIs. Built with a modern tech stack including **Next.js**, **PocketBase**, and **Genkit**, Aran offers a robust solution for managing API lifecycles, enforcing security policies, and ensuring compliance across multiple organizations or departments.

---

## 📖 Table of Contents

*   [✨ Key Features](#-key-features)
*   [🏗️ Architecture](#️-architecture)
*   [🛠️ Technology Stack](#️-technology-stack)
*   [🏁 Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation & Setup](#installation--setup)
    *   [Running the Application](#running-the-application)
*   [📂 Project Structure](#-project-structure)
*   [🗺️ Roadmap](#️-roadmap)
*   [🤝 Contributing](#-contributing)
*   [📄 License](#-license)

## ✨ Key Features

*   **🏢 Multi-Tenant Architecture**: Securely isolate data, configurations, and policies for different organizations or teams within a single deployment.
*   **🤖 Automated API Discovery**: Intelligently discover and profile new and shadow APIs by analyzing traffic patterns.
*   **📚 API Catalog**: A centralized, searchable inventory of all discovered APIs, complete with documentation, ownership, and operational status.
*   **🛡️ Security Policies**: Define and enforce granular security policies, including authentication, authorization, rate limiting, and request validation.
*   **📊 Real-time Dashboard**: An intuitive dashboard providing real-time insights into API usage, performance metrics, and security events.
*   **🔐 Role-Based Access Control (RBAC)**: Fine-grained permissions to control user access to APIs, security policies, and management functions.
*   **🧠 AI-Powered Threat Detection**: Utilizes Genkit to power anomaly detection models that identify unusual API traffic and potential security threats.
*   **🔒 Model Context Protocol (MCP) Security**: Specialized security measures for protecting AI/ML model APIs from prompt injection and data leakage.
*   **✍️ Audit Logging**: Comprehensive and immutable audit logs for all activities, tracked per tenant for compliance and forensic analysis.

## 🏗️ Architecture

Aran API Sentinel is built on a decoupled architecture that ensures scalability and maintainability.

*   **Frontend**: A dynamic and responsive user interface built with **Next.js** and React. It communicates with the backend via a type-safe API layer.
*   **Backend/Database**: **PocketBase** serves as the core backend. It's a single-file Go application that provides a powerful Admin UI, real-time database (embedded SQLite), user authentication, and file storage out of the box.
*   **AI/ML Integration**: **Genkit** orchestrates AI flows for complex tasks. It integrates with various language models to power features like intelligent API discovery and threat detection based on traffic analysis.

## 🛠️ Technology Stack

| Category          | Technology / Library                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**      | [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [TypeScript](https://www.typescriptlang.org/) |
| **Backend**       | [PocketBase](https://pocketbase.io/) (Go)                                                                                                       |
| **Database**      | [SQLite](https://www.sqlite.org/index.html) (embedded)                                                                                          |
| **AI / ML**       | [Google's Genkit](https://firebase.google.com/docs/genkit)                                                                                      |
| **Package Manager** | [pnpm](https://pnpm.io/)                                                                                                                        |
| **Deployment**    | Vercel (Frontend), Fly.io / VPS (Backend)                                                                                                       |

## 🏁 Getting Started

Follow these instructions to get Aran API Sentinel up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed:
*   [Node.js](https://nodejs.org/en) (v18 or later)
*   [pnpm](https://pnpm.io/installation) (or npm/yarn)
*   [Go](https://go.dev/doc/install) (v1.21 or later)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/aran-api-sentinel.git
    cd aran-api-sentinel
    ```

2.  **Set up the Backend (PocketBase):**
    *   Navigate to the PocketBase directory: `cd pocketbase`
    *   Build the Go application: `go build`
    *   Start the server: `./pocketbase serve`
    *   Open your browser to `http://127.0.0.1:8090/_/`.
    *   Create your first admin account. This will be your super-admin for the platform.
    *   (Optional) Use the Admin UI to create initial data collections as needed.

3.  **Set up the Frontend (Next.js):**
    *   Navigate to the frontend directory: `cd ../frontend`
    *   Install dependencies: `pnpm install`
    *   Create a local environment file from the example: `cp .env.example .env.local`
    *   Update `.env.local` with your PocketBase server URL:
        ```env
        NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
        ```

4.  **Set up AI/ML Flows (Genkit):**
    *   Navigate to the Genkit directory: `cd ../genkit`
    *   Install dependencies: `pnpm install`
    *   Configure your AI provider. For example, if using Google AI, set up your API key in your environment:
        ```bash
        export GOOGLE_API_KEY="your-google-ai-api-key"
        ```

### Running the Application

You will need to run the three main components in separate terminal windows.

*   **Terminal 1: Start PocketBase Backend**
    ```bash
    cd pocketbase
    ./pocketbase serve
    ```

*   **Terminal 2: Start Next.js Frontend**
    ```bash
    cd frontend
    pnpm dev
    ```
    Your application will be available at `http://localhost:3000`.

*   **Terminal 3: Start Genkit Tools UI**
    ```bash
    cd genkit
    genkit start
    ```
    The Genkit inspection UI will be available at `http://localhost:4000`.

## 📂 Project Structure

The repository is organized as a monorepo to manage the different services.

```
.
├── 📂 frontend/         # Next.js 14 App Router UI
├── 📂 pocketbase/       # PocketBase Go backend and data
│   ├── pb_migrations/ # Database schema migrations
│   ├── pb_data/       # SQLite database file
│   └── main.go        # Main Go application file
├── 📂 genkit/           # Genkit AI flows and tools
├── .gitignore
└── README.md
```

## 🗺️ Roadmap

We have an exciting roadmap ahead! Here are some of the features we are planning to work on.

| Quarter      | Key Features                                                              | Status      |
| ------------ | ------------------------------------------------------------------------- | ----------- |
| **Q3 2024**  | Core multi-tenant platform launch                                         | ✅ Done     |
|              | Enhanced API discovery heuristics                                         | ⏳ In Progress |
|              | Webhook support for security event notifications                          | 🗓️ Planned   |
| **Q4 2024**  | Advanced analytics and reporting suite                                    | 🗓️ Planned   |
|              | Integration with CI/CD pipelines (GitHub Actions, Jenkins)                | 🗓️ Planned   |
|              | Support for GraphQL API security                                          | 🗓️ Planned   |
| **2025+**    | Plugin marketplace for custom security rules and integrations             | 💡 Idea     |
|              | On-premise deployment options for enterprise customers                    | 💡 Idea     |
|              | Automated compliance reporting (GDPR, HIPAA, etc.)                        | 💡 Idea     |

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please refer to the `CONTRIBUTING.md` file for guidelines.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
