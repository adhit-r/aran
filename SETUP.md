# 🚀 Quick Setup Guide

## Option 1: Local Setup (Recommended)

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

## Option 2: Podman Setup (Containerized)

```bash
# Clone the repository
git clone https://github.com/radhi1991/aran.git
cd aran

# Install dependencies
bun install

# Run Podman setup (requires Podman installed)
bun run setup:podman

# The application will be available at http://localhost:9002
```

## What the Setup Does

### Local Setup:
1. **📦 Downloads PocketBase** (if not already installed)
2. **🚀 Starts PocketBase server** in background
3. **👤 Creates admin account** with your credentials
4. **📝 Creates collections** (companies, users)
5. **📊 Seeds sample data** (TechCorp, SecureBank)
6. **✅ Provides access URLs** and test credentials

### Podman Setup:
1. **🐳 Checks Podman installation**
2. **📦 Builds and starts containers**
3. **🚀 Runs PocketBase with migrations**
4. **📊 Seeds sample data automatically**
5. **✅ Provides containerized environment**

## Access URLs

- **Frontend**: http://localhost:9002
- **PocketBase Admin**: http://127.0.0.1:8090/_/
- **Admin Login**: `admin@aran.com` / `admin123`

## Test Credentials

- **TechCorp**: `admin@techcorp.com` / `admin123`
- **SecureBank**: `admin@securebank.com` / `admin123`

## Troubleshooting

If setup fails:

1. **Check ports**: Make sure nothing is using port 8090
2. **Manual setup**: Run `bun run setup:manual` for step-by-step
3. **Reset**: Delete `pb_data/` folder and run setup again

## Manual Setup (if needed)

```bash
# Step 1: Start PocketBase
./pocketbase/pocketbase serve --http="127.0.0.1:8090" --dir="./pb_data"

# Step 2: Create collections in admin panel
# Go to http://127.0.0.1:8090/_/ and create collections manually

# Step 3: Seed data
bun run setup:companies
```

That's it! 🎉 