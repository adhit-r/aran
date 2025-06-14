# Aran

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

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

```mermaid
graph TD
    A[User] --> B(Next.js Frontend);
    B --> C{Firebase};
    C --> B;
    B --> D[Genkit AI Flows];
    D --> B;
    D --> E[External AI Services];
end
```

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

*   **Live Site (Once Deployed)**: The live documentation will be available at `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/` (Please update this URL after the first deployment via GitHub Pages, ensuring the path reflects your GitHub Pages configuration, e.g., it might include the Docusaurus site's `baseUrl` if not deploying to a root).
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
