# Aran API Sentinel: Your AI-Powered API Security & Governance Platform

Aran API Sentinel is an intelligent platform designed to give organizations comprehensive visibility, security, and control over their entire API ecosystem. In today's interconnected digital landscape, APIs are critical assets, and Aran empowers you to manage them effectively.

**What Aran Does:**
*   **Automated API Discovery**: Leverages AI to continuously discover all your APIs, including shadow and zombie APIs, providing a complete inventory.
*   **Centralized API Catalog**: Offers a searchable, well-organized catalog of all discovered and registered APIs, complete with metadata and documentation links.
*   **Robust API Security**: Implements security best practices by helping you define, enforce, and monitor security policies across your APIs.
*   **AI-Driven Threat Detection**: Proactively identifies and alerts on anomalous API traffic patterns and potential security threats.
*   **Streamlined API Governance**: Facilitates consistent governance, ensuring APIs adhere to organizational standards and compliance requirements.

Built with Next.js for a responsive frontend, Firebase for backend services, and powered by Genkit for advanced AI capabilities, Aran API Sentinel is your solution for modern API lifecycle management and security.

## 🚀 Running the Frontend

To run the frontend development server, follow these steps:

1.  **Install dependencies**: This command installs all the necessary packages for the frontend application.
    ```bash
    npm install
    ```
2.  **Start the Next.js development server**: This command starts the development server, usually on `http://localhost:3000`.
    ```bash
    npm run dev
    ```
    The Next.js development server supports hot reloading, so changes you make to the code will be reflected in your browser automatically.

## 🧠 Running the Backend (AI Flows)

Genkit flows are used to define and run the backend AI logic.

To run the Genkit AI flows for development:
This command starts the Genkit development environment, allowing you to test and run your AI flows locally. You can usually access the Genkit developer UI at `http://localhost:4000` to inspect flows and their execution.
```bash
npm run genkit:dev
```

For running with auto-reloading when file changes are detected:
This command provides a convenient way to develop, as Genkit will automatically restart when you modify your flow definitions.
```bash
npm run genkit:watch
```

## 🏗️ System Architecture

Aran API Sentinel integrates several key technologies to deliver its comprehensive features:

```mermaid
graph TD
    A[User/Administrator] --> B(Next.js Frontend - Aran UI);
    B --> C{Firebase Backend (Auth, Firestore, Storage)};
    C --> B;
    B --> D[Genkit AI Flows (API Discovery, Threat Detection, etc.)];
    D --> B; % For results/data to frontend
    D --> C; % For storing/retrieving data from Firestore
    D --> E[External AI Services (e.g., Google Gemini via Vertex AI)];
```

*   **User/Administrator**: Interacts with Aran via the web interface to manage APIs, view dashboards, configure policies, and respond to security alerts.
*   **Next.js Frontend (Aran UI)**: The primary, responsive user interface built with Next.js and React. It provides all user-facing functionalities like the API catalog, documentation inventory, policy management, threat dashboards, and administrative controls.
*   **Firebase Backend**: Provides core backend-as-a-service capabilities:
    *   **Authentication**: Manages user identities and access control.
    *   **Firestore**: A NoSQL database used as the central repository for API metadata, discovered specifications, security policies, user data, audit logs, and threat intelligence.
    *   **Cloud Storage**: (Conceptual for API Document Inventory) Used for storing uploaded API specification files (e.g., OpenAPI, Postman collections).
*   **Genkit AI Flows**: These are server-side TypeScript functions, orchestrated by the Genkit framework, that execute the platform's AI-driven logic. Key responsibilities include:
    *   Automated discovery of APIs by analyzing network traffic or code repositories.
    *   Intelligent threat detection by processing API request/response patterns and identifying anomalies.
    *   AI-assisted governance, such as compliance checks or documentation generation assistance.
*   **External AI Services**: To perform advanced analysis and generation tasks, Genkit AI flows interface with powerful external AI models (e.g., Google's Gemini models via Vertex AI, or other Large Language Models).

## 📄 Documentation

Comprehensive documentation for Aran API Sentinel is available on our Docusaurus-powered site, located in the `docs/website` directory. This site includes:

*   **Product Information**: An overview of Aran API Sentinel, its architecture, and core value propositions.
*   **Feature Guides**: Detailed explanations of all major features. Explore guides on:
    *   AI-Powered API Discovery
    *   Configuring Threat Detection parameters
    *   Setting up Security Policies
    *   Managing Access Control (RBAC)
    *   Understanding the MCP Catalog
    *   And more...
*   **Technical Documentation**: Setup information, workflow diagrams, and future API references.

**Accessing the Documentation:**

*   **Live Site (Once Deployed)**: The live documentation will be available at `https://radhi1991.github.io/aran/` (Please update this URL if your GitHub username or repository name changes, or if you use a custom domain).
*   **Local Development**:
    1.  Navigate to the `docs/website` directory in your terminal:
        ```bash
        cd docs/website
        ```
    2.  Install dependencies (if you haven't already):
        ```bash
        npm install
        ```
        (or `yarn install` if you prefer Yarn)
    3.  Start the Docusaurus development server:
        ```bash
        npm run start
        ```
        (or `yarn start`)
    4.  Open the site in your browser, typically at `http://localhost:3000`.

We encourage you to explore the documentation site for a complete understanding of Aran API Sentinel.
