# Aran API Sentinel: Your API Security & Governance Platform

Built with Next.js for a responsive frontend and **PocketBase** for multi-tenant backend, Aran API Sentinel is your solution for modern API lifecycle management and security.

## 🚀 **Multi-Tenant Architecture**

Aran now features a complete multi-tenant architecture powered by **PocketBase**:

### **🏢 Company/Tenant Isolation:**
- **Multi-Company Support**: Each company has isolated data and users
- **Role-Based Access**: Admin, Manager, Analyst, Viewer roles per company
- **Secure Data Separation**: Complete tenant isolation with PocketBase rules
- **Company Branding**: Custom logos and settings per company

### **🔐 Authentication & Authorization:**
- **PocketBase Auth**: Built-in authentication with multi-tenant support
- **Real-time Updates**: Live data synchronization across all clients
- **Session Management**: Secure session handling per tenant
- **Audit Logging**: Comprehensive activity tracking per company

## Core Features

*   **Automated API Discovery**: Uses pattern matching and rule-based analysis to discover APIs from traffic data, providing a complete inventory.
*   **Centralized API Catalog**: Offers a searchable, well-organized catalog of all discovered and registered APIs, complete with metadata and documentation links.
*   **API Security**: Implements security best practices by helping you define, enforce, and monitor security policies across your APIs.
*   **Threat Detection**: Proactively identifies and alerts on anomalous API traffic patterns and potential security threats using rule-based analysis.
*   **MCP Security**: **Comprehensive Model Context Protocol security** for AI/ML applications, protecting against real-world threats like tool poisoning, line jumping, tool shadowing, prompt injection, broken authorization, and data exfiltration.
*   **Streamlined API Governance**: Facilitates consistent governance, ensuring APIs adhere to organizational standards and compliance requirements.

## 🛠️ **Quick Start**

### **Prerequisites:**
- Node.js 18+ 
- npm or yarn

### **1. Install Dependencies:**
```bash
npm install
```

### **2. Start PocketBase Backend:**
```bash
npm run pocketbase
```
This starts PocketBase at `http://127.0.0.1:8090`

### **3. Start Next.js Frontend:**
```bash
npm run dev
```
This starts Aran at `http://localhost:9002`

### **4. Start Both Together:**
```bash
npm run dev:full
```

## 📊 **PocketBase Admin Panel**

Access the PocketBase admin panel at `http://127.0.0.1:8090/_/` to:

- **Manage Companies**: Create and configure tenant companies
- **User Management**: Add users and assign roles per company
- **Data Management**: View and manage all collections
- **Real-time Monitoring**: Monitor API usage and performance

## 🏗️ **Multi-Tenant Database Schema**

### **Collections:**
- **`companies`**: Company/tenant information and settings
- **`users`**: Multi-tenant user accounts with role-based access
- **`api_documents`**: API specification files per company
- **`api_catalog`**: API catalog entries per company
- **`mcp_implementations`**: MCP implementations per company
- **`security_policies`**: Security policies per company
- **`audit_logs`**: Activity logs per company

### **Security Rules:**
All collections include tenant isolation rules:
```javascript
// Example: Users can only access their company's data
listRule: "@request.auth.id != '' && @request.auth.record.company = company"
```

## 🔧 **Development**

### **Environment Variables:**
Create `.env.local`:
```bash
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

### **Available Scripts:**
- `npm run dev` - Start Next.js development server
- `npm run pocketbase` - Start PocketBase backend
- `npm run dev:full` - Start both servers together
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## 📚 **Documentation**

### **📖 Live Documentation**
- **GitHub Pages**: [https://radhi1991.github.io/aran](https://radhi1991.github.io/aran)
- **Auto-deployed**: Updates automatically on push to main branch
- **Search**: Full-text search across all documentation

### **🔧 Documentation Development**
```bash
# Start documentation development server
npm run docs:dev

# Build documentation
npm run docs:build

# Preview built documentation
npm run docs:preview
```

## 🚀 **Production Deployment**

### **Docker Deployment:**
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### **Manual Deployment:**
```bash
# Build the application
npm run build

# Start PocketBase (production)
./pb_data/pocketbase serve --http="0.0.0.0:8090" --dir="./pb_data"

# Start Next.js (production)
npm start
```

## 📈 **Multi-Tenant Benefits**

### **✅ For SaaS Providers:**
- **Scalable Architecture**: Easy to add new companies
- **Data Isolation**: Complete separation between tenants
- **Custom Branding**: Company-specific logos and settings
- **Usage Analytics**: Per-company usage tracking

### **✅ For Enterprise:**
- **Department Isolation**: Separate workspaces per department
- **Role-Based Security**: Granular permissions per user
- **Audit Compliance**: Complete activity logging
- **Custom Policies**: Company-specific security rules

### **✅ For Developers:**
- **Real-time Updates**: Live data synchronization
- **Admin Panel**: Easy data management interface
- **API-First**: RESTful API for all operations
- **Type Safety**: Full TypeScript support

## 🔐 **Security Features**

- **Tenant Isolation**: Complete data separation
- **Role-Based Access**: Granular permissions
- **Audit Logging**: Comprehensive activity tracking
- **Real-time Security**: Live threat detection
- **API Rate Limiting**: Per-company API usage limits
- **Secure File Storage**: Encrypted file handling
- **MCP Security**: **Comprehensive AI/ML security** protecting against real-world MCP threats

## 📚 **Documentation Sections**

- **Fumadocs MDX**: Modern, type-safe documentation system
- **API Reference**: PocketBase REST API documentation
- **Admin Guide**: Multi-tenant administration guide
- **Developer Guide**: Integration and customization
- **Security Guide**: Best practices and compliance
- **MCP Security Guide**: Comprehensive AI/ML security documentation

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

---

**Aran API Sentinel** - Your complete multi-tenant API security and governance platform with **comprehensive MCP Security**! 🚀
