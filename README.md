# Aran API Sentinel

A comprehensive API security and monitoring platform that provides real-time threat detection, automated vulnerability scanning, and intelligent API management.

## Features

- 🔒 **API Security Scanning**: Automated detection of API vulnerabilities
- 🛡️ **Threat Detection**: Real-time monitoring for security threats
- 📊 **API Catalog**: Centralized API documentation and management
- 🔍 **MCP Discovery**: Model Context Protocol integration
- 👥 **Access Control**: Role-based access control (RBAC)
- 📈 **Analytics**: Comprehensive security analytics and reporting

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/aran-api-sentinel.git
cd aran-api-sentinel

# Install dependencies
bun install

# Start development server
bun run dev:full
```

Visit `http://localhost:9002` to access the application.

## Security

This project follows OSSF (Open Source Security Foundation) best practices and implements comprehensive security measures:

### 🔒 Security Features

- **OSSF Scorecard**: Automated security scoring and assessment
- **Dependency Scanning**: Regular vulnerability checks with Dependabot
- **Code Analysis**: Static and dynamic security analysis with CodeQL
- **Security Policies**: Comprehensive security policies and procedures
- **Vulnerability Management**: Automated vulnerability scanning and reporting

### 🛡️ Security Workflows

- **OSSF Scorecard**: Runs on every PR and weekly to assess security posture
- **Dependency Review**: Scans dependencies for vulnerabilities on every PR
- **CodeQL Analysis**: Static code analysis for security vulnerabilities
- **Security Scanning**: Comprehensive security scanning with multiple tools

### 📋 Security Checklist

- [x] OSSF Scorecard integration
- [x] Dependency vulnerability scanning
- [x] Static code analysis
- [x] Security policy documentation
- [x] Automated security workflows
- [x] Vulnerability disclosure process
- [x] Security best practices guide

### 🚨 Security Reporting

If you discover a security vulnerability, please report it responsibly:

- **Email**: security@aran-api-sentinel.com
- **GitHub**: [Security Advisories](https://github.com/your-org/aran-api-sentinel/security/advisories)
- **Response Time**: Within 48 hours

For more information, see our [Security Policy](SECURITY.md) and [Security Best Practices](docs/security-best-practices.md).

## Development

### Prerequisites

- [Bun](https://bun.sh/) (>=1.0.0)
- [Node.js](https://nodejs.org/) (>=18.0.0)
- [Git](https://git-scm.com/)

### Setup

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
bun run db:migrate

# Seed the database
bun run db:seed

# Start development server
bun run dev:full
```

### Security Commands

```bash
# Run security audit
bun run security:audit

# Fix security vulnerabilities
bun run security:audit:fix

# Update dependencies
bun run security:update

# Run comprehensive security check
bun run security:check
```

### Testing

```bash
# Run tests
bun test

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch
```

## Documentation

- [Security Best Practices](docs/security-best-practices.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Security Contributions

When contributing security-related code:

1. Follow our [Security Best Practices](docs/security-best-practices.md)
2. Run security scans before submitting PRs
3. Ensure all tests pass
4. Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.aran-api-sentinel.com](https://docs.aran-api-sentinel.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/aran-api-sentinel/issues)
- **Security**: [Security Advisories](https://github.com/your-org/aran-api-sentinel/security/advisories)

## Acknowledgments

- [OSSF](https://openssf.org/) for security best practices
- [OWASP](https://owasp.org/) for security guidelines
- [GitHub Security](https://security.github.com/) for security tools
