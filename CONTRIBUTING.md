# Contributing to Aran API Sentinel

First off, thank you for considering contributing to Aran API Sentinel! We welcome any contributions that can help make this project better, whether it's reporting a bug, proposing a new feature, or writing code.

To ensure a smooth and effective collaboration, please review these guidelines.

## Code of Conduct

This project and everyone participating in it is governed by the [Aran API Sentinel Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to `[PROJECT_CONTACT_EMAIL_OR_LINK_TO_ISSUES]`.

## How Can I Contribute?

There are many ways to contribute to Aran API Sentinel:

### Reporting Bugs
*   If you encounter a bug, please ensure it hasn't already been reported by searching the [GitHub Issues](https://github.com/radhi1991/aran/issues) for this repository.
*   If you don't see an open issue addressing the problem, please [open a new one](https://github.com/radhi1991/aran/issues/new). Be sure to include:
    *   A clear and descriptive title.
    *   A detailed description of the issue, including steps to reproduce it.
    *   Information about your environment (e.g., browser version, Node.js version) if applicable.
    *   Any relevant error messages or screenshots.

### Suggesting Enhancements or New Features
*   We welcome suggestions for enhancements or new features! Please start by checking if your idea has already been discussed in [GitHub Issues](https://github.com/radhi1991/aran/issues) or [GitHub Discussions](https://github.com/radhi1991/aran/discussions).
*   If not, please [open a new issue](https://github.com/radhi1991/aran/issues/new) to propose your idea. Provide:
    *   A clear and descriptive title.
    *   A detailed explanation of the enhancement or feature.
    *   The motivation or use case: why would this be useful?
    *   Any potential drawbacks or alternative solutions you've considered.

### Code Contributions

#### Setting Up Your Development Environment
1.  **Prerequisites**: Ensure you have Node.js (version specified in `package.json` `engines` field, e.g., >=18.0) and npm installed.
2.  **Fork & Clone**: Fork the repository on GitHub, then clone your fork locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/aran.git
    cd aran
    ```
3.  **Install Dependencies**:
    *   For the main Next.js application and Genkit flows (from the project root):
        ```bash
        npm install
        ```
    *   For the Docusaurus documentation site:
        ```bash
        cd docs/website
        npm install
        cd ../..
        ```
4.  **Running the Application**: Refer to the main `README.md` for instructions on running the Next.js frontend, Genkit backend, and Docusaurus documentation site.

#### Development Process
*   **Branching**: Create a new branch for your feature or bugfix from an up-to-date `main` branch.
    *   Use a descriptive branch name, e.g., `feature/awesome-new-feature` or `fix/bug-in-component`.
    ```bash
    git checkout main
    git pull origin main
    git checkout -b feature/your-descriptive-branch-name
    ```
*   **Coding Standards**:
    *   Please follow the existing code style.
    *   Ensure your code is well-formatted. Run the linter (if set up):
        ```bash
        npm run lint
        ```
*   **Commit Messages**: Write clear and concise commit messages. Consider using [Conventional Commits](https://www.conventionalcommits.org/) if you are familiar with them (e.g., `feat: Add X feature`, `fix: Resolve Y bug`).
*   **Testing**:
    *   We aim to maintain and increase test coverage. If you are adding new features, please try to include unit or integration tests. For bug fixes, a test demonstrating the fix is highly appreciated.
    *   (Note: Specific testing commands or frameworks are not yet defined in the project, this is a general guideline).

#### Submitting Pull Requests (PRs)
1.  Push your changes to your fork:
    ```bash
    git push origin feature/your-descriptive-branch-name
    ```
2.  Open a Pull Request against the `main` branch of the `radhi1991/aran` repository.
3.  **PR Description**:
    *   Provide a clear title for your PR.
    *   Describe the changes you have made and why.
    *   If your PR addresses an open GitHub issue, link to it (e.g., "Closes #123").
    *   Include any relevant information for reviewers, such as how to test your changes.
4.  **Review Process**: Maintainers will review your PR. Be prepared to discuss your changes and make adjustments if requested. Once approved, your PR will be merged.

## Questions?

If you have questions about contributing, feel free to open an issue or reach out via other project communication channels (if specified).

Thank you for contributing to Aran API Sentinel!
