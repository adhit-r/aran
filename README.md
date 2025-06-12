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

This project now includes a comprehensive documentation site built with Docusaurus, located in the `docs/website` directory. It contains:

*   **Product Information**: Overview of Aran API Sentinel and its capabilities.
*   **Feature Guides**: Detailed explanations of core features.
*   **Technical Documentation**: Initial setup guides and workflow diagrams.

**To view the documentation locally:**

1.  Navigate to the `docs/website` directory:
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
4.  Open `http://localhost:3000` (or the port indicated by Docusaurus, usually 3000) in your browser.

(Once the documentation site is deployed, for example via GitHub Pages, the live URL will be added here.)
