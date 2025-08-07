const fs = require('fs');
const path = require('path');

console.log('📚 Building Aran API Sentinel Documentation...');

// Create build directory
const buildDir = '.fumadocs';
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
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
        .nav {
            background: #f1f5f9;
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
        }
        .nav ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .nav a {
            color: #475569;
            text-decoration: none;
            font-weight: 500;
        }
        .nav a:hover {
            color: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Aran API Sentinel</h1>
            <p>Your complete multi-tenant API security and governance platform</p>
        </div>
        
        <div class="nav">
            <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#architecture">Architecture</a></li>
                <li><a href="#quick-start">Quick Start</a></li>
                <li><a href="#documentation">Documentation</a></li>
                <li><a href="https://github.com/radhi1991/aran">GitHub</a></li>
            </ul>
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
            
            <h2 id="features">🎯 Core Features</h2>
            
            <h3>🔍 Automated API Discovery</h3>
            <p>Uses pattern matching and rule-based analysis to discover APIs from traffic data, providing a complete inventory.</p>
            
            <h3>📚 Centralized API Catalog</h3>
            <p>Offers a searchable, well-organized catalog of all discovered and registered APIs, complete with metadata and documentation links.</p>
            
            <h3>🛡️ API Security</h3>
            <p>Implements security best practices by helping you define, enforce, and monitor security policies across your APIs.</p>
            
            <h3>🚨 Threat Detection</h3>
            <p>Proactively identifies and alerts on anomalous API traffic patterns and potential security threats using rule-based analysis.</p>
            
            <h3>🤖 MCP Security</h3>
            <p>Comprehensive Model Context Protocol security for AI/ML applications, protecting against real-world threats like tool poisoning, line jumping, tool shadowing, prompt injection, broken authorization, and data exfiltration.</p>
            
            <h3>⚙️ Streamlined API Governance</h3>
            <p>Facilitates consistent governance, ensuring APIs adhere to organizational standards and compliance requirements.</p>
            
            <h2 id="architecture">🏗️ Multi-Tenant Architecture</h2>
            
            <h3>🏢 Company/Tenant Isolation:</h3>
            <ul>
                <li><strong>Multi-Company Support</strong>: Each company has isolated data and users</li>
                <li><strong>Role-Based Access</strong>: Admin, Manager, Analyst, Viewer roles per company</li>
                <li><strong>Secure Data Separation</strong>: Complete tenant isolation with PocketBase rules</li>
                <li><strong>Company Branding</strong>: Custom logos and settings per company</li>
            </ul>
            
            <h3>🔐 Authentication & Authorization:</h3>
            <ul>
                <li><strong>PocketBase Auth</strong>: Built-in authentication with multi-tenant support</li>
                <li><strong>Real-time Updates</strong>: Live data synchronization across all clients</li>
                <li><strong>Session Management</strong>: Secure session handling per tenant</li>
                <li><strong>Audit Logging</strong>: Comprehensive activity tracking per company</li>
            </ul>
            
            <h2 id="quick-start">🚀 Quick Start</h2>
            
            <h3>Prerequisites:</h3>
            <ul>
                <li>Node.js 18+</li>
                <li>npm or yarn</li>
            </ul>
            
            <h3>1. Install Dependencies:</h3>
            <pre><code>npm install</code></pre>
            
            <h3>2. Start PocketBase Backend:</h3>
            <pre><code>npm run pocketbase</code></pre>
            <p>This starts PocketBase at <code>http://127.0.0.1:8090</code></p>
            
            <h3>3. Start Next.js Frontend:</h3>
            <pre><code>npm run dev</code></pre>
            <p>This starts Aran at <code>http://localhost:9002</code></p>
            
            <h3>4. Start Both Together:</h3>
            <pre><code>npm run dev:full</code></pre>
            
            <h2 id="documentation">📚 Documentation</h2>
            
            <h3>📖 Live Documentation</h3>
            <ul>
                <li><strong>GitHub Pages</strong>: <a href="https://radhi1991.github.io/aran">https://radhi1991.github.io/aran</a></li>
                <li><strong>Auto-deployed</strong>: Updates automatically on push to main branch</li>
                <li><strong>Search</strong>: Full-text search across all documentation</li>
            </ul>
            
            <h3>🔧 Documentation Development</h3>
            <pre><code># Start documentation development server
npm run docs:dev

# Build documentation
npm run docs:build

# Preview built documentation
npm run docs:preview</code></pre>
            
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

## Deployment
This documentation is automatically deployed to GitHub Pages via GitHub Actions.

## Local Development
To build the documentation locally:
\`\`\`bash
npm run docs:build
\`\`\`

## Features
The documentation includes comprehensive information about:
- Multi-tenant architecture
- API discovery and catalog
- Threat detection and security
- MCP Security for AI/ML applications
- API governance and compliance
- Quick start guide
- Development setup
`;

fs.writeFileSync(path.join(buildDir, 'README.md'), readmeContent);

console.log('✅ Documentation built successfully!');
console.log(`📁 Build directory: ${buildDir}`);
console.log('🌐 Documentation will be deployed to: https://radhi1991.github.io/aran');
