# Aran API Sentinel Documentation

This directory contains the documentation for Aran API Sentinel, built with **Fumadocs MDX**.

## 📚 **Documentation Structure**

```
docs/
├── content/
│   └── docs/
│       ├── index.mdx                 # Main landing page
│       ├── getting-started/
│       │   └── installation.mdx      # Installation guide
│       ├── features/
│       │   ├── overview.mdx          # Features overview
│       │   ├── api-discovery.mdx     # API discovery guide
│       │   ├── threat-detection.mdx  # Threat detection guide
│       │   ├── api-catalog.mdx       # API catalog guide
│       │   └── mcp-security.mdx      # MCP security guide
│       ├── multi-tenant/
│       │   └── setup.mdx             # Multi-tenant setup
│       ├── roadmap.mdx               # Product roadmap
│       ├── api-reference.mdx         # API reference
│       └── security-guide.mdx        # Security guide
├── meta.json                         # Navigation configuration
└── README.md                         # This file
```

## 🚀 **Local Development**

### **Start Documentation Server**
```bash
# Start Fumadocs development server
npm run docs:dev
```

### **Build Documentation**
```bash
# Build static site
npm run docs:build

# Preview built site
npm run docs:preview
```

## 📸 **Screenshots**

The documentation includes real screenshots captured from the application:

- **Dashboard**: Main application dashboard
- **API Discovery**: API discovery interface
- **Threat Detection**: Threat detection page
- **API Catalog**: API catalog management
- **MCP Security**: MCP security monitoring
- **Login**: Multi-tenant login page
- **API Documentation**: Documentation management
- **Security Policies**: Security policy management

### **Capture New Screenshots**
```bash
# Start the application
npm run dev:full

# In another terminal, capture screenshots
npm run screenshots
```

## 🌐 **Deployment**

### **GitHub Pages**

The documentation is automatically deployed to GitHub Pages via GitHub Actions:

1. **Workflow**: `.github/workflows/deploy-documentation.yml`
2. **Trigger**: Push to `main` branch or manual dispatch
3. **URL**: `https://radhi1991.github.io/aran`

### **Deployment Process**

1. **Screenshot Capture**: Automatically captures UI screenshots
2. **Documentation Build**: Builds Fumadocs MDX site
3. **GitHub Pages**: Deploys to GitHub Pages

### **Manual Deployment**

```bash
# Build documentation
npm run docs:build

# Deploy to GitHub Pages (requires gh-pages package)
npx gh-pages -d .fumadocs
```

## 📝 **Content Guidelines**

### **Markdown Format**
- Use **Fumadocs MDX** syntax
- Include frontmatter with metadata
- Use relative paths for images
- Follow the established structure

### **Screenshots**
- Store in `screenshots/` directory
- Use descriptive names
- Include alt text in markdown
- Optimize for web (compress if needed)

### **Navigation**
- Update `meta.json` for navigation changes
- Keep navigation logical and user-friendly
- Group related content together

## 🔧 **Configuration**

### **Fumadocs Configuration**
- **Config File**: `source.config.ts`
- **Content Directory**: `content/docs/`
- **Build Output**: `.fumadocs/`

### **GitHub Pages**
- **Source**: GitHub Actions
- **Branch**: `gh-pages` (auto-generated)
- **Domain**: `https://radhi1991.github.io/aran`

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .fumadocs
   npm run docs:build
   ```

2. **Screenshot Issues**
   ```bash
   # Ensure application is running
   npm run dev:full
   
   # Check Puppeteer installation
   npm install puppeteer
   ```

3. **Deployment Issues**
   - Check GitHub Actions logs
   - Verify repository permissions
   - Ensure GitHub Pages is enabled

### **Local Development Issues**

1. **Port Conflicts**
   ```bash
   # Kill processes on ports
   lsof -ti:9002 | xargs kill -9
   lsof -ti:8090 | xargs kill -9
   ```

2. **Dependencies**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📚 **Resources**

- **[Fumadocs MDX Documentation](https://fumadocs.dev/docs/mdx)**: Official Fumadocs guide
- **[GitHub Pages](https://pages.github.com/)**: GitHub Pages documentation
- **[GitHub Actions](https://docs.github.com/en/actions)**: GitHub Actions guide

## 🤝 **Contributing**

### **Adding New Documentation**

1. **Create MDX File**
   ```bash
   # Create new documentation file
   touch content/docs/your-feature.mdx
   ```

2. **Add Frontmatter**
   ```yaml
   ---
   title: Your Feature
   description: Description of your feature
   image: /screenshots/your-feature.png
   tags: [feature, guide]
   ---
   ```

3. **Update Navigation**
   ```json
   // In meta.json
   {
     "pages": [
       // ... existing pages
       "your-feature"
     ]
   }
   ```

4. **Add Screenshots**
   ```bash
   # Capture screenshots
   npm run screenshots
   ```

### **Updating Existing Documentation**

1. **Edit MDX Files**: Modify content in `content/docs/`
2. **Update Screenshots**: Re-capture if UI changes
3. **Test Locally**: `npm run docs:dev`
4. **Commit Changes**: Push to trigger deployment

---

**Aran API Sentinel Documentation** - Built with ❤️ using Fumadocs MDX 