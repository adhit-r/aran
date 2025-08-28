#!/usr/bin/env bun

import { pb } from '../src/lib/pocketbase';

console.log('🏗️ Setting up PocketBase with admin credentials...');

async function setupWithAdmin() {
  try {
    // Login as admin using the correct endpoint
    console.log('🔐 Logging in as admin...');
    
    const response = await fetch('http://127.0.0.1:8090/api/admins/auth-with-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
              body: JSON.stringify({
          identity: process.env.POCKETBASE_ADMIN_EMAIL || 'admin@aran.com',
          password: process.env.POCKETBASE_ADMIN_PASSWORD || 'admin123'
        })
    });

    if (!response.ok) {
      throw new Error(`Admin login failed: ${response.status}`);
    }

    const authData = await response.json();
    console.log('✅ Admin login successful');

    // Set the auth token for subsequent requests
    pb.authStore.save(authData.token, authData.admin);

    // Create collections
    await createCollections();
    
    // Seed data
    await seedData();
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

async function createCollections() {
  console.log('📝 Creating collections...');
  
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

  try {
    await pb.collections.create(companiesCollection);
    console.log('✅ Created companies collection');
  } catch (error: any) {
    if (error.status === 400 && error.response?.message?.includes('already exists')) {
      console.log('✅ Companies collection already exists');
    } else {
      console.error('❌ Failed to create companies collection:', error.message);
    }
  }

  try {
    await pb.collections.create(usersCollection);
    console.log('✅ Created users collection');
  } catch (error: any) {
    if (error.status === 400 && error.response?.message?.includes('already exists')) {
      console.log('✅ Users collection already exists');
    } else {
      console.error('❌ Failed to create users collection:', error.message);
    }
  }
}

async function seedData() {
  console.log('📊 Seeding sample data...');
  
  const companies = [
    {
      name: 'TechCorp',
      domain: 'techcorp.aran.com',
      logo: 'https://via.placeholder.com/150x50/2563eb/ffffff?text=TechCorp',
      settings: {
        theme: 'light',
        timezone: 'UTC',
        features: ['api-discovery', 'threat-detection']
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
        features: ['api-discovery', 'threat-detection', 'compliance']
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
      const existing = await pb.collection('companies').getFirstListItem(`name = "${company.name}"`);
      console.log(`✅ Company ${company.name} already exists`);
      createdCompanies.push(existing);
    } catch {
      const created = await pb.collection('companies').create(company);
      console.log(`✅ Created company: ${company.name} (${created.id})`);
      createdCompanies.push(created);
    }
  }

  // Create users
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const company = createdCompanies[i];
    
    try {
      const existing = await pb.collection('users').getFirstListItem(`email = "${user.email}"`);
      console.log(`✅ User ${user.email} already exists`);
    } catch {
      const userData = {
        ...user,
        company: company.id
      };
      const created = await pb.collection('users').create(userData);
      console.log(`✅ Created user: ${user.email} (${created.id})`);
    }
  }

  console.log('🎉 Sample data setup complete!');
  console.log('\n📋 Access URLs:');
  companies.forEach(company => {
    console.log(`   ${company.domain} - ${company.name}`);
  });
  
  console.log('\n🔑 Test Credentials:');
  users.forEach(user => {
    console.log(`   ${user.email} / ${user.password} (${user.role})`);
  });
}

setupWithAdmin();
