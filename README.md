# Aran API Sentinel

**Multi-tenant API Security & Governance Platform**

Aran API Sentinel is a comprehensive platform for API discovery, threat detection, and security governance with multi-tenant support powered by PocketBase. Built with Next.js 15, React 18, and Bun for optimal performance and developer experience.

## Overview

Aran API Sentinel provides enterprise-grade API security and governance capabilities with a focus on multi-tenant architecture. The platform combines rule-based analysis with intelligent AI routing to deliver comprehensive API security monitoring and threat detection.

## Key Features

### Multi-Tenant Security
- Complete data isolation between organizations
- Subdomain-based routing (`company.aran.com`)
- Role-based access control (Admin, Manager, Analyst, Viewer)
- Real-time data synchronization across tenants

### API Security
- Automated API discovery and cataloging
- Rule-based and AI-powered threat detection
- Model Context Protocol (MCP) security monitoring
- Built-in compliance reporting and auditing

### Hybrid AI Intelligence
- Intelligent routing: Ollama → OpenAI → Gemini → Rule-based
- Local AI processing for privacy-sensitive analysis
- Cloud AI integration for complex analysis
- Reliable rule-based fallback system

## Technology Stack

### Frontend
- **Next.js 15** - App Router with Turbopack
- **React 18** - Modern UI with hooks
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

### Backend
- **PocketBase** - Real-time backend with built-in auth
- **SQLite** - Local database for metadata
- **Bun** - Fast JavaScript runtime and package manager

### AI Integration
- **Ollama** - Local LLM inference
- **OpenAI** - GPT-4 for complex analysis
- **Gemini** - Google's AI for API insights
- **Rule-based** - Reliable fallback system

## Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (>=1.0.0)
- [Git](https://git-scm.com/)
- [Podman](https://podman.io/) (optional, for containerized setup)

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/radhi1991/aran.git
cd aran

# Install dependencies
bun install

# Run complete setup (downloads PocketBase, creates collections, seeds data)
bun run setup

# Start the application
bun run dev
```

### Containerized Setup (Podman)

```bash
# Clone the repository
git clone https://github.com/radhi1991/aran.git
cd aran

# Install dependencies
bun install

# Run Podman setup
bun run setup:podman

# Access at http://localhost:9002
```

## Access URLs

- **Frontend Application**: http://localhost:9002
- **PocketBase Admin**: http://127.0.0.1:8090/_/
- **Documentation**: https://radhi1991.github.io/aran/

## Authentication

### Admin Credentials
- **Email**: admin@aran.com
- **Password**: admin123

### Sample Organizations

**TechCorp**
- **Domain**: techcorp.aran.com
- **Email**: admin@techcorp.com
- **Password**: admin123
- **Features**: API Discovery & Threat Detection

**SecureBank**
- **Domain**: securebank.aran.com
- **Email**: admin@securebank.com
- **Password**: admin123
- **Features**: Financial Security & Compliance

## Development Commands

### Core Development
```bash
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
```

### Database Management
```bash
bun run db:seed          # Seed sample data
bun run db:migrate       # Run database migrations
bun run backup:create    # Create database backup
bun run backup:restore   # Restore from backup
```

### Testing
```bash
bun run test             # Run all tests
bun run test:watch       # Run tests in watch mode
bun run test:coverage    # Generate coverage report
bun run test:ai-router   # Test AI routing system
```

### AI Provider Management
```bash
bun run monitor:start    # Start AI provider monitoring
bun run monitor:stop     # Stop monitoring
```

### Deployment
```bash
bun run deploy:staging   # Deploy to staging
bun run deploy:production # Deploy to production
```

## Architecture

### Multi-Tenant Design
The platform implements a comprehensive multi-tenant architecture with complete data isolation:

- **Company Isolation**: Each organization has isolated data and users
- **Subdomain Routing**: Automatic routing based on subdomain
- **Role-Based Access**: Granular permissions per user role
- **Real-time Sync**: Live data synchronization across tenants

### AI Integration
Intelligent AI routing system with fallback mechanisms:

1. **Ollama** (Local) - Privacy-sensitive analysis
2. **OpenAI** (Cloud) - Complex analysis with GPT-4
3. **Gemini** (Cloud) - Google's AI for API insights
4. **Rule-based** (Fallback) - Reliable core detection

### Security Features
- **API Discovery**: Automated API cataloging and monitoring
- **Threat Detection**: Real-time security analysis
- **MCP Security**: Model Context Protocol monitoring
- **Compliance**: Built-in reporting and auditing

## Configuration

### Environment Variables
Copy `env.example` to `.env` and configure:

```bash
# PocketBase Configuration
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@aran.com
POCKETBASE_ADMIN_PASSWORD=admin123

# AI Provider Configuration
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
OLLAMA_URL=http://localhost:11434

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_MULTI_TENANT=true
ENABLE_MCP_SECURITY=true
```

## Troubleshooting

### Common Issues

**Port Conflicts**
- Ensure ports 8090 and 9002 are available
- Check for running instances with `lsof -i :8090`

**PocketBase Issues**
- Verify PocketBase is running: `curl http://127.0.0.1:8090/api/health`
- Check admin credentials in `.env`

**Build Errors**
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `bun install`

### Podman Setup Issues
- Install Podman: `brew install podman` (macOS)
- Start machine: `podman machine start`
- Check logs: `podman-compose logs`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Security

### Reporting Vulnerabilities
If you discover a security vulnerability, please report it responsibly:

- **Email**: security@aran-api-sentinel.com
- **GitHub**: [Security Advisories](https://github.com/radhi1991/aran/security/advisories)
- **Response Time**: Within 48 hours

### Security Features
- OSSF Scorecard integration
- Dependency vulnerability scanning
- Static code analysis with CodeQL
- Comprehensive security policies
- Automated security workflows

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [https://radhi1991.github.io/aran/](https://radhi1991.github.io/aran/)
- **Issues**: [GitHub Issues](https://github.com/radhi1991/aran/issues)
- **Discussions**: [GitHub Discussions](https://github.com/radhi1991/aran/discussions)

## Acknowledgments

- [PocketBase](https://pocketbase.io/) for the real-time backend
- [Next.js](https://nextjs.org/) for the React framework
- [Bun](https://bun.sh/) for the JavaScript runtime
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Aran API Sentinel** - Secure, Scalable, Multi-tenant API Governance
