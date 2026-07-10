# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅         |

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

Please report security issues directly to the project maintainer by opening a private/confidential GitHub issue or via email.

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and aim to release a patch within 7 days for critical issues.

## Security Practices

- All passwords hashed with bcrypt
- JWT tokens expire and are validated server-side
- Rate limiting on all API endpoints (200 req/15min)
- Helmet.js security headers
- MongoDB Atlas with IP allowlist and encrypted connections
- File uploads restricted by MIME type and size (Multer)
