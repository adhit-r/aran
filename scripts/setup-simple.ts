#!/usr/bin/env bun

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Simple Aran API Sentinel Setup');
console.log('==================================');

async function simpleSetup() {
  try {
    // Step 1: Check if PocketBase exists
    console.log('\n📦 Step 1: Checking PocketBase installation...');
    
    const pbPath = join(process.cwd(), 'pocketbase', 'pocketbase');
    if (!existsSync(pbPath)) {
      console.log('⚠️ PocketBase not found. Downloading...');
      
      // Create pocketbase directory
      execSync('mkdir -p pocketbase', { stdio: 'inherit' });
      
      // Download PocketBase for Linux
      const downloadUrl = 'https://github.com/pocketbase/pocketbase/releases/download/v0.22.6/pocketbase_0.22.6_linux_amd64.zip';
      console.log('📥 Downloading PocketBase...');
      
      execSync(`curl -L ${downloadUrl} -o pocketbase.zip`, { stdio: 'inherit' });
      execSync('cd pocketbase && unzip ../pocketbase.zip', { stdio: 'inherit' });
      execSync('rm -f ../pocketbase.zip', { stdio: 'inherit' });
      execSync('chmod +x pocketbase', { stdio: 'inherit' });
      
      console.log('✅ PocketBase downloaded and installed');
    } else {
      console.log('✅ PocketBase already installed');
    }

    // Step 2: Start PocketBase
    console.log('\n🔄 Step 2: Starting PocketBase server...');
    
    try {
      // Check if PocketBase is already running
      const healthCheck = await fetch('http://127.0.0.1:8090/api/health');
      if (healthCheck.ok) {
        console.log('✅ PocketBase is already running');
      } else {
        throw new Error('PocketBase not responding');
      }
    } catch {
      console.log('🚀 Starting PocketBase server...');
      execSync('./pocketbase/pocketbase serve --http="127.0.0.1:8090" --dir="./pb_data" --origins="http://localhost:9002,http://127.0.0.1:9002"', {
        stdio: 'ignore',
        detached: true
      });
      
      // Wait for server to start
      console.log('⏳ Waiting for PocketBase to start...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Step 3: Provide instructions
    console.log('\n📝 Step 3: Manual Setup Required');
    console.log('================================');
    console.log('✅ PocketBase is now running at http://127.0.0.1:8090');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Open http://127.0.0.1:8090/_/ in your browser');
    console.log('2. Create a new admin account with:');
    console.log('   - Email: admin@aran.com');
    console.log('   - Password: admin123');
    console.log('3. After creating the admin account, run:');
    console.log('   bun run setup:collections');
    console.log('');
    console.log('🎯 To start the frontend application:');
    console.log('   bun run dev');
    console.log('');
    console.log('🌐 Access URLs:');
    console.log('   - Frontend: http://localhost:9002');
    console.log('   - PocketBase Admin: http://127.0.0.1:8090/_/');
    console.log('');
    console.log('✅ Setup complete! PocketBase is ready for configuration.');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

simpleSetup();