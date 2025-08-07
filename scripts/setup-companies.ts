#!/usr/bin/env bun

import { pb } from '../src/lib/pocketbase';

console.log('🏢 Setting up sample companies with subdomain configuration...');

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
    role: 'admin',
    company: 'techcorp'
  },
  {
    email: 'admin@securebank.com',
    name: 'SecureBank Admin',
    password: 'admin123',
    role: 'admin',
    company: 'securebank'
  }
];

async function setupCompanies() {
  try {
    console.log('📝 Creating companies...');
    
    for (const company of companies) {
      try {
        const existing = await pb.collection('companies').getFirstListItem(`name = "${company.name}"`);
        console.log(`✅ Company ${company.name} already exists`);
      } catch {
        const created = await pb.collection('companies').create({
          name: company.name,
          domain: company.domain,
          logo: company.logo,
          settings: company.settings,
          status: company.status
        });
        console.log(`✅ Created company: ${company.name} (${created.id})`);
      }
    }

    console.log('👥 Creating users...');
    
    for (const user of users) {
      try {
        const company = await pb.collection('companies').getFirstListItem(`name = "${user.company.charAt(0).toUpperCase() + user.company.slice(1)}"`);
        
        try {
          const existing = await pb.collection('users').getFirstListItem(`email = "${user.email}"`);
          console.log(`✅ User ${user.email} already exists`);
        } catch {
          const created = await pb.collection('users').create({
            email: user.email,
            name: user.name,
            password: user.password,
            passwordConfirm: user.password,
            company: company.id,
            role: user.role,
            verified: true
          });
          console.log(`✅ Created user: ${user.email} (${created.id})`);
        }
      } catch (error) {
        console.error(`❌ Failed to create user ${user.email}:`, error);
      }
    }

    console.log('🎉 Multi-tenant setup complete!');
    console.log('\n📋 Access URLs:');
    companies.forEach(company => {
      console.log(`   ${company.domain} - ${company.name}`);
    });
    
    console.log('\n🔑 Test Credentials:');
    users.forEach(user => {
      console.log(`   ${user.email} / ${user.password} (${user.role})`);
    });

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupCompanies();
