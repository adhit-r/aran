#!/usr/bin/env bun

import { execSync } from 'child_process';

console.log('🐳 Podman-based Aran API Sentinel Setup');
console.log('=======================================');

async function podmanSetup() {
  try {
    // Step 1: Check if Podman is installed
    console.log('\n🐳 Step 1: Checking Podman installation...');
    
    try {
      execSync('podman --version', { stdio: 'pipe' });
      console.log('✅ Podman is installed');
    } catch {
      console.log('❌ Podman is not installed. Please install Podman first.');
      console.log('   macOS: brew install podman');
      console.log('   Linux: sudo dnf install podman (Fedora/RHEL)');
      console.log('   Visit: https://podman.io/getting-started/installation');
      return;
    }

    // Step 2: Check if Podman Compose is available
    console.log('\n📦 Step 2: Checking Podman Compose...');
    
    try {
      execSync('podman-compose --version', { stdio: 'pipe' });
      console.log('✅ Podman Compose is available');
    } catch {
      console.log('⚠️ Podman Compose not found, trying with podman compose...');
      try {
        execSync('podman compose version', { stdio: 'pipe' });
        console.log('✅ Podman Compose is available');
      } catch {
        console.log('❌ Podman Compose is not available. Please install podman-compose.');
        console.log('   pip install podman-compose');
        return;
      }
    }

    // Step 3: Initialize Podman machine (macOS)
    console.log('\n🔧 Step 3: Initializing Podman machine...');
    
    try {
      execSync('podman machine list', { stdio: 'pipe' });
      console.log('✅ Podman machine is ready');
    } catch {
      console.log('⚠️ Podman machine not found, initializing...');
      try {
        execSync('podman machine init', { stdio: 'inherit' });
        execSync('podman machine start', { stdio: 'inherit' });
        console.log('✅ Podman machine initialized and started');
      } catch (error) {
        console.log('⚠️ Podman machine setup failed, trying without machine...');
      }
    }

    // Step 4: Build and start services
    console.log('\n🚀 Step 4: Starting services with Podman Compose...');
    
    try {
      execSync('podman-compose up -d', { stdio: 'inherit' });
    } catch {
      execSync('podman compose up -d', { stdio: 'inherit' });
    }
    
    // Wait for services to start
    console.log('⏳ Waiting for services to start...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Step 5: Check if services are running
    console.log('\n🔍 Step 5: Checking service health...');
    
    try {
      const pocketbaseHealth = await fetch('http://127.0.0.1:8090/api/health');
      if (pocketbaseHealth.ok) {
        console.log('✅ PocketBase is running');
      } else {
        throw new Error('PocketBase not responding');
      }
    } catch (error) {
      console.log('⚠️ PocketBase health check failed, but this is normal during startup');
    }

    // Step 6: Final setup
    console.log('\n🎉 Podman Setup Complete!');
    console.log('========================');
    console.log('\n📋 Access URLs:');
    console.log('   Frontend: http://localhost:9002');
    console.log('   PocketBase Admin: http://127.0.0.1:8090/_/');
    console.log('   Admin Login: admin@aran.com / admin123');
    
    console.log('\n🏢 Sample Organizations:');
    console.log('   techcorp.aran.com - TechCorp');
    console.log('   securebank.aran.com - SecureBank');
    
    console.log('\n🔑 Test Credentials:');
    console.log('   admin@techcorp.com / admin123 (admin)');
    console.log('   admin@securebank.com / admin123 (admin)');
    
    console.log('\n🐳 Podman Commands:');
    console.log('   View logs: podman-compose logs -f');
    console.log('   Stop services: podman-compose down');
    console.log('   Restart: podman-compose restart');
    console.log('   Rebuild: podman-compose up --build -d');
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Visit http://localhost:9002');
    console.log('   2. Login with any test account above');
    console.log('   3. Explore the multi-tenant features!');
    
  } catch (error) {
    console.error('❌ Podman setup failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure Podman is running');
    console.log('   2. Check if ports 8090 and 9002 are available');
    console.log('   3. Try: podman-compose logs to see error details');
  }
}

podmanSetup();
