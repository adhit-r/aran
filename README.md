# Aran API Sentinel

## Enterprise-Grade API Security & Governance Platform

```mermaid
graph TD
    A[API Requests] --> B{Threat Detection}
    B -->|Malicious| C[Incident Response]
    B -->|Benign| D[Process Request]
    C --> E[Alerting & Logging]
    E --> F[Remediation]
    F --> G[Reporting & Analytics]
```

## Table of Contents
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Development](#development)
- [License](#license)

## Key Features

### 🛡️ API Security & Protection
- **API Discovery & Inventory**
  - Automated API endpoint discovery
  - Comprehensive API catalog with versioning
  - Real-time API traffic monitoring
  - Schema validation and drift detection

- **Threat Detection & Prevention**
  - Real-time API traffic analysis
  - OWASP API Security Top 10 protection
  - Rate limiting and throttling
  - Bot detection and mitigation
  - Anomaly detection using machine learning

- **Authentication & Authorization**
  - OAuth 2.0 and OpenID Connect support
  - API key management
  - JWT validation
  - Role-based access control (RBAC)
  - Fine-grained permissions

### 🏢 Enterprise Features
- **Multi-tenancy**
  - Isolated environments for different teams/organizations
  - Custom security policies per tenant
  - Tenant-specific analytics and reporting
  - Centralized administration

- **Compliance & Governance**
  - Automated compliance checks (GDPR, HIPAA, PCI-DSS)
  - Audit logging and trail
  - Data classification and protection
  - Policy as Code support

### 🤖 AI & Automation
- **Intelligent Threat Detection**
  - Anomaly detection using ML models
  - Behavioral analysis of API traffic
  - Predictive threat intelligence
  - Automated incident response

- **AI-Powered Analysis**
  - Natural language API documentation
  - Automated API testing
  - Smart traffic pattern recognition
  - Root cause analysis

### 📊 Analytics & Reporting
- **Real-time Dashboards**
  - API performance metrics
  - Security incident tracking
  - Traffic analysis
  - User activity monitoring

- **Custom Reports**
  - Scheduled report generation
  - Export to multiple formats (PDF, CSV, JSON)
  - Custom metrics and KPIs
  - SLA monitoring

### 🛠️ Integration & Extensibility
- **Threat Intelligence Feeds**
  - Integration with leading threat feeds
  - Custom feed support
  - Automatic IOC (Indicators of Compromise) updates
  - Threat reputation scoring

- **Developer Experience**
  - OpenAPI/Swagger support
  - API mocking
  - Automated documentation
  - SDK generation

### 🔄 Workflow Automation
- **Incident Response**
  - Automated alerting
  - Playbook integration
  - Remediation workflows
  - Escalation policies

- **CI/CD Integration**
  - Shift-left security
  - Automated security testing
  - Policy enforcement in pipelines
  - Deployment gating

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| React 18 | UI components and hooks |
| Tailwind CSS | Utility-first styling |
| Radix UI | Accessible component primitives |

### Backend
| Technology | Purpose |
|------------|---------|
| PocketBase | Real-time backend with auth |
| SQLite | Local database for metadata |
| Bun | JavaScript runtime and package manager |

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (>=1.0.0)
- [Git](https://git-scm.com/)
- [Podman](https://podman.io/) (optional)

### Local Development

```bash
# Clone the repository
git clone https://github.com/radhi1991/aran.git
cd aran

# Install dependencies
bun install

# Run setup (downloads PocketBase, creates collections, seeds data)
bun run setup

# Start development server
bun run dev
```

### Access URLs
- **Frontend**: http://localhost:9002
- **PocketBase Admin**: http://127.0.0.1:8090/_/
- **Documentation**: https://radhi1991.github.io/aran/

## Architecture

### Multi-Tenant Design
```mermaid
graph LR
    A[Client] --> B[Load Balancer]
    B --> C[API Gateway]
    C --> D[Authentication]
    D --> E[Rate Limiter]
    E --> F[Threat Detection]
    F --> G[Business Logic]
    G --> H[Database]
```

### Security Features
1. **Authentication**
   - JWT-based authentication
   - Role-based access control
   - Session management

2. **API Protection**
   - Rate limiting
   - Request validation
   - Data sanitization

## Configuration

### Environment Variables
```bash
# Core
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=file:./dev.db

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Email (for notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=your-password
```

## Development

### Available Scripts
| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run linter |
| `bun run format` | Format code |
| `bun run test` | Run tests |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Aran API Sentinel - Enterprise API Security Platform</p>
  <p> 2025 Aran Security. All rights reserved.</p>
</div>
