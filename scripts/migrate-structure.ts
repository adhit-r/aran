#!/usr/bin/env bun

import { existsSync, mkdirSync, readdirSync, renameSync } from 'fs';
import { join, resolve } from 'path';

// Configuration for the new directory structure
const CONFIG = {
  // Source directories to process
  sourceDirs: [
    'src/app/(app)',
    'src/components',
    'src/lib',
  ],
  
  // Mapping of old paths to new paths
  pathMappings: {
    // Move API-related pages
    'src/app/(app)/api-': 'src/app/(dashboard)/api/',
    
    // Move security-related pages
    'src/app/(app)/security-policies': 'src/app/(dashboard)/security/policies',
    'src/app/(app)/threat-detection': 'src/app/(dashboard)/security/threats',
    
    // Move components
    'src/components/api-': 'src/components/dashboard/api/',
    'src/components/security/': 'src/components/security/',
    
    // Move services
    'src/lib/security/': 'src/services/security/',
    'src/lib/api/': 'src/services/api/',
  },
  
  // Directories to create
  directoriesToCreate: [
    'src/app/(auth)',
    'src/app/(dashboard)/api',
    'src/app/(dashboard)/security',
    'src/app/(dashboard)/settings',
    'src/components/forms',
    'src/components/layout',
    'src/services/api',
    'src/services/security',
    'src/services/analytics',
    'src/utils/helpers',
    'src/utils/validators',
    'src/utils/constants',
  ],
  
  // Files/directories to skip
  skipPatterns: [
    'node_modules',
    '.next',
    '.git',
    'public',
    'dist',
    'build',
    'coverage',
  ],
};

class StructureMigrator {
  private rootDir: string;
  private dryRun: boolean;
  private changes: { from: string; to: string }[] = [];
  private createdDirs: Set<string> = new Set();

  constructor(dryRun: boolean = true) {
    this.rootDir = process.cwd();
    this.dryRun = dryRun;
  }

  public async run() {
    console.log('🚀 Starting codebase reorganization...');
    console.log(this.dryRun ? '🔍 Dry run mode - no changes will be made' : '🚀 Production mode - making changes');

    // 1. Create required directories
    await this.createDirectories();

    // 2. Process files and move them to new locations
    for (const sourceDir of CONFIG.sourceDirs) {
      const fullPath = join(this.rootDir, sourceDir);
      if (existsSync(fullPath)) {
        await this.processDirectory(fullPath);
      } else {
        console.warn(`⚠️ Source directory not found: ${sourceDir}`);
      }
    }

    // 3. Show summary
    this.showSummary();
  }

  private async createDirectories() {
    console.log('\n📂 Creating required directories...');
    for (const dir of CONFIG.directoriesToCreate) {
      const fullPath = join(this.rootDir, dir);
      if (!existsSync(fullPath)) {
        console.log(`  - Creating: ${dir}`);
        if (!this.dryRun) {
          mkdirSync(fullPath, { recursive: true });
          this.createdDirs.add(fullPath);
        }
      }
    }
  }

  private async processDirectory(dir: string) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relativePath = fullPath.replace(this.rootDir, '');

        // Skip if this path matches any skip patterns
        if (this.shouldSkip(relativePath)) {
          continue;
        }

        if (entry.isDirectory()) {
          await this.processDirectory(fullPath);
        } else if (entry.isFile()) {
          await this.processFile(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error);
    }
  }

  private async processFile(filePath: string) {
    const relativePath = filePath.replace(this.rootDir, '');
    const newPath = this.getNewPath(relativePath);

    if (newPath !== relativePath) {
      this.changes.push({
        from: relativePath,
        to: newPath,
      });

      if (!this.dryRun) {
        try {
          const targetPath = join(this.rootDir, newPath);
          const targetDir = resolve(targetPath, '..');
          if (!existsSync(targetDir)) {
            mkdirSync(targetDir, { recursive: true });
            this.createdDirs.add(targetDir);
          }
          renameSync(filePath, targetPath);
        } catch (error) {
          console.error(`Error moving file ${filePath}:`, error);
        }
      }
    }
  }

  private getNewPath(relativePath: string): string {
    let newPath = relativePath;
    
    // Apply path mappings
    for (const [oldPattern, newPattern] of Object.entries(CONFIG.pathMappings)) {
      if (relativePath.includes(oldPattern)) {
        newPath = relativePath.replace(oldPattern, newPattern);
        break;
      }
    }

    return newPath;
  }

  private shouldSkip(relativePath: string): boolean {
    // Skip if path matches any skip patterns
    return CONFIG.skipPatterns.some(pattern => 
      relativePath.includes(pattern) || 
      relativePath.startsWith('/' + pattern) ||
      relativePath.includes('/' + pattern + '/')
    );
  }

  private showSummary() {
    console.log('\n📊 Migration Summary:');
    console.log(`  - Total files to be moved: ${this.changes.length}`);
    
    if (this.changes.length > 0) {
      console.log('\n📝 Changes to be made:');
      this.changes.slice(0, 10).forEach(change => {
        console.log(`  - ${change.from}  →  ${change.to}`);
      });
      
      if (this.changes.length > 10) {
        console.log(`  - ...and ${this.changes.length - 10} more files`);
      }
    }

    if (this.dryRun) {
      console.log('\n💡 This was a dry run. To apply changes, run with --apply flag');
    } else {
      console.log('\n✅ Migration completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Update imports in your code to reflect the new paths');
      console.log('2. Run `bun run lint --fix` to fix any import issues');
      console.log('3. Test your application to ensure everything works as expected');
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--apply');

// Run the migrator
const migrator = new StructureMigrator(dryRun);
migrator.run().catch(console.error);
