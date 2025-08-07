const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📚 Building Aran API Sentinel Documentation...');

// Create build directory
const buildDir = '.fumadocs';
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy screenshots to build directory
const screenshotsDir = path.join(buildDir, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

if (fs.existsSync('screenshots')) {
  console.log('📸 Copying screenshots...');
  execSync(`cp -r screenshots/* ${screenshotsDir}/`);
}

// Create basic HTML structure
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aran API Sentinel Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .content {
            padding: 40px 20px;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        .feature-card {
            background: #f8fafc;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #e2e8f0;
        }
        .feature-card h3 {
            margin: 0 0 15px 0;
            color: #1e293b;
            font-size: 1.5rem;
        }
        .feature-card p {
            margin: 0;
            color: #64748b;
            line-height: 1.6;
        }
        .screenshot {
            width: 100%;
            max-width: 600px;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 20px 0;
        }
        .cta {
            background: #2563eb;
            color: white;
            padding: 15px 30px;
            border-radius: 6px;
            text-decoration: none;
            display: inline-block;
            margin: 20px 0;
            font-weight: 600;
            transition: background 0.2s;
        }
        .cta:hover {
            background: #1d4ed8;
        }
        .footer {
            background: #1e293b;
            color: white;
            text-align: center;
            padding: 20px;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Aran API Sentinel</h1>
            <p>Your complete multi-tenant API security and governance platform</p>
        </div>
        
        <div class="content">
            <h2>📖 Documentation</h2>
            <p>Welcome to the Aran API Sentinel documentation. This platform provides comprehensive API security and governance with multi-tenant architecture.</p>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🔐 Multi-Tenant Security</h3>
                    <p>Complete tenant isolation with PocketBase backend, role-based access control, and secure data separation.</p>
                </div>
                
                <div class="feature-card">
                    <h3>🤖 MCP Security</h3>
                    <p>Comprehensive Model Context Protocol security for AI/ML applications, protecting against real-world threats.</p>
                </div>
                
                <div class="feature-card">
                    <h3>🔍 API Discovery</h3>
                    <p>Automated API discovery using pattern matching and rule-based analysis for complete inventory.</p>
                </div>
                
                <div class="feature-card">
                    <h3>🛡️ Threat Detection</h3>
                    <p>Real-time threat detection with rule-based analysis and anomaly scoring for proactive security.</p>
                </div>
                
                <div class="feature-card">
                    <h3>📚 API Catalog</h3>
                    <p>Centralized API catalog with search, filtering, and governance features for complete management.</p>
                </div>
                
                <div class="feature-card">
                    <h3>📊 Dashboard Analytics</h3>
                    <p>Real-time monitoring and analytics with comprehensive metrics and insights.</p>
                </div>
            </div>
            
            <h2>🖼️ Application Screenshots</h2>
            <p>Real screenshots from the Aran API Sentinel application:</p>
            
            <h3>📊 Dashboard Overview</h3>
            <img src="/screenshots/dashboard.png" alt="Dashboard" class="screenshot">
            
            <h3>🔍 API Discovery</h3>
            <img src="/screenshots/api-discovery.png" alt="API Discovery" class="screenshot">
            
            <h3>🛡️ Threat Detection</h3>
            <img src="/screenshots/threat-detection.png" alt="Threat Detection" class="screenshot">
            
            <h3>📚 API Catalog</h3>
            <img src="/screenshots/api-catalog.png" alt="API Catalog" class="screenshot">
            
            <h3>🤖 MCP Security</h3>
            <img src="/screenshots/mcp-security.png" alt="MCP Security" class="screenshot">
            
            <h3>🔐 Multi-Tenant Login</h3>
            <img src="/screenshots/login.png" alt="Login" class="screenshot">
            
            <h2>🚀 Getting Started</h2>
            <p>Ready to secure and govern your APIs? Get started with Aran API Sentinel:</p>
            
            <a href="https://github.com/radhi1991/aran" class="cta">View on GitHub</a>
            
            <h2>📚 Documentation Sections</h2>
            <ul>
                <li><strong>Installation Guide</strong> - Complete setup instructions</li>
                <li><strong>Multi-Tenant Setup</strong> - Configure multi-tenant architecture</li>
                <li><strong>Features Overview</strong> - Complete feature guide</li>
                <li><strong>API Discovery</strong> - Automated API discovery</li>
                <li><strong>Threat Detection</strong> - Security monitoring</li>
                <li><strong>API Catalog</strong> - API management</li>
                <li><strong>MCP Security</strong> - AI/ML application security</li>
                <li><strong>Product Roadmap</strong> - Future development plans</li>
                <li><strong>API Reference</strong> - Technical API documentation</li>
                <li><strong>Security Guide</strong> - Security best practices</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2025 Aran API Sentinel - Built with ❤️ for API security and governance</p>
        </div>
    </div>
</body>
</html>
`;

// Write the HTML file
fs.writeFileSync(path.join(buildDir, 'index.html'), htmlContent);

// Create a simple README for the build
const readmeContent = `
# Aran API Sentinel Documentation

This directory contains the built documentation for Aran API Sentinel.

## Files
- \`index.html\` - Main documentation page
- \`screenshots/\` - Application screenshots

## Deployment
This documentation is automatically deployed to GitHub Pages via GitHub Actions.

## Local Development
To build the documentation locally:
\`\`\`bash
npm run docs:build
\`\`\`

## Screenshots
The documentation includes real screenshots captured from the application:
- Dashboard overview
- API discovery interface
- Threat detection page
- API catalog management
- MCP security monitoring
- Multi-tenant login
- API documentation
- Security policies
`;

fs.writeFileSync(path.join(buildDir, 'README.md'), readmeContent);

console.log('✅ Documentation built successfully!');
console.log(`📁 Build directory: ${buildDir}`);
console.log('🌐 Documentation will be deployed to: https://radhi1991.github.io/aran'); 