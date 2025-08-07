# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [security@aran-api-sentinel.com](mailto:security@aran-api-sentinel.com).

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- Type of issue (buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Security Best Practices

### For Contributors

1. **Code Review**: All code changes must be reviewed by at least one maintainer
2. **Dependency Updates**: Keep dependencies updated and monitor for vulnerabilities
3. **Security Testing**: Run security scans before submitting PRs
4. **Secrets Management**: Never commit secrets or sensitive data
5. **Input Validation**: Always validate and sanitize user inputs

### For Users

1. **Keep Updated**: Always use the latest stable version
2. **Monitor Logs**: Regularly check application logs for suspicious activity
3. **Network Security**: Use HTTPS in production and secure network configurations
4. **Access Control**: Implement proper authentication and authorization
5. **Backup Strategy**: Maintain regular backups of your data

## Security Features

Aran API Sentinel includes several security features:

- **API Security Scanning**: Automated detection of API vulnerabilities
- **Threat Detection**: Real-time monitoring for security threats
- **Access Control**: Role-based access control (RBAC)
- **Audit Logging**: Comprehensive audit trails
- **Data Encryption**: Encryption at rest and in transit
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Protection against abuse and DDoS

## Security Updates

We regularly release security updates to address vulnerabilities. These updates are:

- **Critical**: Released within 24 hours
- **High**: Released within 72 hours
- **Medium**: Released within 1 week
- **Low**: Released within 1 month

## Responsible Disclosure

We follow responsible disclosure practices:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report
2. **Investigation**: We will investigate and provide updates on our progress
3. **Coordination**: We will coordinate with you on the disclosure timeline
4. **Credit**: We will credit you in our security advisories (unless you prefer anonymity)

## Security Contacts

- **Security Team**: [security@aran-api-sentinel.com](mailto:security@aran-api-sentinel.com)
- **PGP Key**: [security-pgp-key.asc](https://github.com/your-org/aran-api-sentinel/raw/main/security-pgp-key.asc)
- **Security Advisories**: [GitHub Security Advisories](https://github.com/your-org/aran-api-sentinel/security/advisories)

## Bug Bounty

We currently do not have a formal bug bounty program, but we do appreciate security researchers who responsibly disclose vulnerabilities. We may offer recognition or other forms of appreciation for significant findings.

## Compliance

This project follows security best practices and standards:

- **OWASP Top 10**: We follow OWASP security guidelines
- **CWE/SANS Top 25**: We address common weakness enumerations
- **NIST Cybersecurity Framework**: We align with NIST guidelines
- **ISO 27001**: We follow information security management principles

## Security Metrics

We track and report on security metrics:

- **Vulnerability Response Time**: Average time to patch vulnerabilities
- **Security Score**: OSSF Scorecard rating
- **Dependency Health**: Regular dependency vulnerability scans
- **Code Quality**: Static analysis and security linting results

For more information about our security practices, please see our [Security Documentation](https://docs.aran-api-sentinel.com/security).
