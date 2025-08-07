#!/usr/bin/env bun

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🚀 Complete Aran API Sentinel Setup');
console.log('=====================================');

async function completeSetup() {
  try {
    // Step 1: Check if PocketBase exists
    console.log('\n📦 Step 1: Checking PocketBase installation...');
    
    const pbPath = join(process.cwd(), 'pocketbase', 'pocketbase');
    if (!existsSync(pbPath)) {
      console.log('⚠️ PocketBase not found. Downloading...');
      
      // Create pocketbase directory
      execSync('mkdir -p pocketbase', { stdio: 'inherit' });
      
      // Download PocketBase for macOS
      const downloadUrl = 'https://github.com/pocketbase/pocketbase/releases/download/v0.22.6/pocketbase_0.22.6_darwin_amd64.zip';
      console.log('📥 Downloading PocketBase...');
      
      execSync(`curl -L ${downloadUrl} -o pocketbase.zip`, { stdio: 'inherit' });
      execSync('cd pocketbase && unzip ../pocketbase.zip', { stdio: 'inherit' });
      execSync('rm -f ../pocketbase.zip', { stdio: 'inherit' });
      execSync('chmod +x pocketbase', { stdio: 'inherit' });
      
      console.log('✅ PocketBase downloaded and installed');
    } else {
      console.log('✅ PocketBase already installed');
    }

    // Step 2: Start PocketBase in background
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

    // Step 3: Create admin account
    console.log('\n👤 Step 3: Setting up admin account...');
    
    try {
      const adminResponse = await fetch('http://127.0.0.1:8090/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.POCKETBASE_ADMIN_EMAIL || 'admin@aran.com',
          password: process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123',
          passwordConfirm: process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123',
          name: 'Admin User'
        })
      });

      if (adminResponse.ok) {
        console.log('✅ Admin account created');
      } else {
        const error = await adminResponse.json();
        if (error.message?.includes('already exists')) {
          console.log('✅ Admin account already exists');
        } else {
          console.log('⚠️ Admin creation failed (this is normal if admin exists)');
        }
      }
    } catch (error) {
      console.log('⚠️ Admin creation failed (this is normal if admin exists)');
    }

    // Step 4: Login and create collections
    console.log('\n📝 Step 4: Creating collections...');
    
    const loginResponse = await fetch('http://127.0.0.1:8090/api/admins/auth-with-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
              body: JSON.stringify({
          identity: process.env.POCKETBASE_ADMIN_EMAIL || 'admin@aran.com',
          password: process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123'
        })
    });

    if (!loginResponse.ok) {
      throw new Error('Admin login failed');
    }

    const authData = await loginResponse.json();
    const token = authData.token;
    console.log('✅ Admin login successful');

    // Create companies collection
    const companiesCollection = {
      name: "companies",
      type: "base",
      system: false,
      schema: [
        {
          id: "name",
          name: "name",
          type: "text",
          system: false,
          required: true,
          unique: false,
          options: {
            min: 2,
            max: 100,
            pattern: ""
          }
        },
        {
          id: "domain",
          name: "domain",
          type: "text",
          system: false,
          required: false,
          unique: true,
          options: {
            min: 0,
            max: 100,
            pattern: ""
          }
        },
        {
          id: "logo",
          name: "logo",
          type: "text",
          system: false,
          required: false,
          unique: false,
          options: {
            min: 0,
            max: 1000,
            pattern: ""
          }
        },
        {
          id: "settings",
          name: "settings",
          type: "json",
          system: false,
          required: false,
          unique: false,
          options: {}
        },
        {
          id: "status",
          name: "status",
          type: "select",
          system: false,
          required: true,
          unique: false,
          options: {
            maxSelect: 1,
            values: ["active", "suspended", "pending"]
          }
        }
      ],
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''"
    };

    const companiesResponse = await fetch('http://127.0.0.1:8090/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(companiesCollection)
    });

    if (companiesResponse.ok) {
      console.log('✅ Created companies collection');
    } else {
      const error = await companiesResponse.json();
      if (error.message?.includes('already exists')) {
        console.log('✅ Companies collection already exists');
      } else {
        console.log('⚠️ Companies creation failed:', error.message);
      }
    }

    // Create users collection
    const usersCollection = {
      name: "users",
      type: "auth",
      system: false,
      schema: [
        {
          id: "name",
          name: "name",
          type: "text",
          system: false,
          required: true,
          unique: false,
          options: {
            min: 2,
            max: 100,
            pattern: ""
          }
        },
        {
          id: "company",
          name: "company",
          type: "relation",
          system: false,
          required: true,
          unique: false,
          options: {
            collectionId: "companies",
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: ["name"]
          }
        },
        {
          id: "role",
          name: "role",
          type: "select",
          system: false,
          required: true,
          unique: false,
          options: {
            maxSelect: 1,
            values: ["admin", "manager", "analyst", "viewer"]
          }
        },
        {
          id: "avatar",
          name: "avatar",
          type: "text",
          system: false,
          required: false,
          unique: false,
          options: {
            min: 0,
            max: 1000,
            pattern: ""
          }
        },
        {
          id: "verified",
          name: "verified",
          type: "bool",
          system: false,
          required: false,
          unique: false,
          options: {}
        }
      ],
      listRule: "@request.auth.id != '' && @request.auth.record.company = company",
      viewRule: "@request.auth.id != '' && @request.auth.record.company = company",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && @request.auth.record.company = company",
      deleteRule: "@request.auth.id != '' && @request.auth.record.company = company"
    };

    const usersResponse = await fetch('http://127.0.0.1:8090/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(usersCollection)
    });

    if (usersResponse.ok) {
      console.log('✅ Created users collection');
    } else {
      const error = await usersResponse.json();
      if (error.message?.includes('already exists')) {
        console.log('✅ Users collection already exists');
      } else {
        console.log('⚠️ Users creation failed:', error.message);
      }
    }

    // Step 5: Seed sample data
    console.log('\n📊 Step 5: Seeding sample data...');
    
    const companies = [
      {
        name: 'TechCorp',
        domain: 'techcorp.aran.com',
        logo: 'https://via.placeholder.com/150x50/2563eb/ffffff?text=TechCorp',
        settings: {
          theme: 'light',
          timezone: 'UTC',
          features: ['api-discovery', 'threat-detection', 'mcp-security']
        },
        status: 'active'
      },
      {
        name: 'SecureBank',
        domain: 'securebank.aran.com',
        logo: 'https://via.placeholder.com/150x50/16a34a/ffffff?text=SecureBank',
        settings: {
          theme: 'dark',
          timezone: 'America/New_York',
          features: ['api-discovery', 'threat-detection', 'mcp-security', 'compliance']
        },
        status: 'active'
      }
    ];

    const users = [
      {
        email: 'admin@techcorp.com',
        name: 'TechCorp Admin',
        password: 'admin123',
        passwordConfirm: 'admin123',
        role: 'admin',
        verified: true
      },
      {
        email: 'admin@securebank.com',
        name: 'SecureBank Admin',
        password: 'admin123',
        passwordConfirm: 'admin123',
        role: 'admin',
        verified: true
      }
    ];

    // Create companies
    const createdCompanies = [];
    for (const company of companies) {
      try {
        const existing = await fetch(`http://127.0.0.1:8090/api/collections/companies/records?filter=(name='${company.name}')`, {
          headers: {
            'Authorization': token
          }
        });
        
        if (existing.ok) {
          const existingData = await existing.json();
          if (existingData.items.length > 0) {
            console.log(`✅ Company ${company.name} already exists`);
            createdCompanies.push(existingData.items[0]);
          } else {
            const created = await fetch('http://127.0.0.1:8090/api/collections/companies/records', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify(company)
            });
            
            if (created.ok) {
              const createdData = await created.json();
              console.log(`✅ Created company: ${company.name} (${createdData.id})`);
              createdCompanies.push(createdData);
            }
          }
        }
      } catch (error) {
        console.log(`⚠️ Failed to create company ${company.name}`);
      }
    }

    // Create users
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const company = createdCompanies[i];
      
      if (company) {
        try {
          const existing = await fetch(`http://127.0.0.1:8090/api/collections/users/records?filter=(email='${user.email}')`, {
            headers: {
              'Authorization': token
            }
          });
          
          if (existing.ok) {
            const existingData = await existing.json();
            if (existingData.items.length > 0) {
              console.log(`✅ User ${user.email} already exists`);
            } else {
              const userData = {
                ...user,
                company: company.id
              };
              
              const created = await fetch('http://127.0.0.1:8090/api/collections/users/records', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
                },
                body: JSON.stringify(userData)
              });
              
              if (created.ok) {
                console.log(`✅ Created user: ${user.email}`);
              }
            }
          }
        } catch (error) {
          console.log(`⚠️ Failed to create user ${user.email}`);
        }
      }
    }

    // Step 6: Final setup
    console.log('\n🎉 Setup Complete!');
    console.log('==================');
    console.log('\n📋 Access URLs:');
    console.log('   Frontend: http://localhost:9002');
    console.log('   PocketBase Admin: http://127.0.0.1:8090/_/');
    console.log('   Admin Login: admin@aran.com / admin123');
    
    console.log('\n🏢 Sample Organizations:');
    companies.forEach(company => {
      console.log(`   ${company.domain} - ${company.name}`);
    });
    
    console.log('\n🔑 Test Credentials:');
    users.forEach(user => {
      console.log(`   ${user.email} / ${user.password} (${user.role})`);
    });
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Start the frontend: bun run dev');
    console.log('   2. Visit http://localhost:9002');
    console.log('   3. Login with any test account above');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure no other process is using port 8090');
    console.log('   2. Check if PocketBase is running: curl http://127.0.0.1:8090/api/health');
    console.log('   3. Try manual setup: bun run setup:manual');
  }
}

completeSetup();
