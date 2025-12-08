#!/usr/bin/env node

/**
 * Script to add MIT License header to source files
 * Usage:
 *   node scripts/add-license-header.js --check    # Check files without modification
 *   node scripts/add-license-header.js --fix      # Add headers to files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// License header template
const LICENSE_HEADER = `/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */

`;

// Configuration
const CONFIG = {
  rootDir: process.cwd(),
  patterns: [
    'backend/src/**/*.ts',
    'web/src/**/*.ts',
    'web/src/**/*.tsx',
    'mobile/app/**/*.ts',
    'mobile/app/**/*.tsx',
    'mobile/components/**/*.ts',
    'mobile/components/**/*.tsx',
    'mobile/services/**/*.ts',
    'mobile/services/**/*.tsx',
    'mobile/hooks/**/*.ts',
    'mobile/hooks/**/*.tsx',
    'mobile/context/**/*.ts',
    'mobile/context/**/*.tsx',
    'mobile/store/**/*.ts',
    'mobile/store/**/*.tsx',
    'mobile/utils/**/*.ts',
    'mobile/utils/**/*.tsx',
    'shared/src/**/*.ts',
  ],
  exclude: [
    '**/node_modules/**',
    '**/*.d.ts',
    '**/*.config.{ts,js,mjs}',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/.expo/**',
    '**/coverage/**',
  ],
};

/**
 * Find all files matching patterns using git ls-files for better performance
 */
function findFiles() {
  const files = [];

  for (const pattern of CONFIG.patterns) {
    try {
      // Extract directory and extension from pattern
      // e.g., 'backend/src/**/*.ts' -> dir='backend', pattern='src/**/*.ts'
      const parts = pattern.split('/');
      const dir = parts[0];
      const subPattern = parts.slice(1).join('/');

      // Use git ls-files with -C (run in subdirectory)
      const gitFiles = execSync(`git -C "${dir}" ls-files "${subPattern}"`, {
        cwd: CONFIG.rootDir,
        encoding: 'utf8',
      })
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((file) => `${dir}/${file}`); // Prepend directory back

      files.push(...gitFiles);
    } catch (error) {
      // If git command fails, try without -C flag
      try {
        const gitFiles = execSync(`git ls-files "${pattern}"`, {
          cwd: CONFIG.rootDir,
          encoding: 'utf8',
        })
          .trim()
          .split('\n')
          .filter(Boolean);

        files.push(...gitFiles);
      } catch (e) {
        console.warn(`Warning: Could not find files for ${pattern}`);
      }
    }
  }

  // Remove duplicates and filter excluded patterns
  const uniqueFiles = [...new Set(files)];
  return uniqueFiles.filter((file) => {
    const fullPath = path.join(CONFIG.rootDir, file);
    return (
      fs.existsSync(fullPath) &&
      !CONFIG.exclude.some((pattern) => {
        const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
        return regex.test(file);
      })
    );
  });
}

/**
 * Check if file already has license header
 */
function hasLicenseHeader(content) {
  // Check for SPDX identifier or copyright in first 300 chars
  const header = content.substring(0, 300);
  return (
    header.includes('SPDX-License-Identifier') ||
    header.includes('Copyright (c) 2025 NEU-DataVerse')
  );
}

/**
 * Extract shebang line if exists
 */
function extractShebang(content) {
  if (content.startsWith('#!')) {
    const firstNewline = content.indexOf('\n');
    return {
      shebang: content.substring(0, firstNewline + 1),
      rest: content.substring(firstNewline + 1),
    };
  }
  return { shebang: '', rest: content };
}

/**
 * Add license header to file content
 */
function addLicenseToContent(content) {
  const { shebang, rest } = extractShebang(content);

  // Remove leading whitespace/newlines from rest
  const trimmedRest = rest.trimStart();

  return `${shebang}${LICENSE_HEADER}${trimmedRest}`;
}

/**
 * Process a single file
 */
function processFile(filePath, fix = false) {
  const fullPath = path.join(CONFIG.rootDir, filePath);

  try {
    const content = fs.readFileSync(fullPath, 'utf8');

    // Skip empty files
    if (content.trim().length === 0) {
      return { status: 'skipped', reason: 'empty' };
    }

    // Check if already has license
    if (hasLicenseHeader(content)) {
      return { status: 'skipped', reason: 'has-header' };
    }

    // Add license header
    if (fix) {
      const newContent = addLicenseToContent(content);
      fs.writeFileSync(fullPath, newContent, 'utf8');
      return { status: 'modified' };
    } else {
      return { status: 'missing-header' };
    }
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const fix = args.includes('--fix');
  const check = args.includes('--check');

  if (!fix && !check) {
    console.error('Usage: node add-license-header.js [--check|--fix]');
    console.error('  --check  Check files without modifying');
    console.error('  --fix    Add license headers to files');
    process.exit(1);
  }

  console.log('🔍 Finding source files...\n');
  const files = findFiles();
  console.log(`Found ${files.length} files to process\n`);

  const results = {
    modified: [],
    skipped: [],
    missingHeader: [],
    errors: [],
  };

  // Process each file
  files.forEach((file) => {
    const result = processFile(file, fix);

    switch (result.status) {
      case 'modified':
        results.modified.push(file);
        break;
      case 'skipped':
        results.skipped.push(file);
        break;
      case 'missing-header':
        results.missingHeader.push(file);
        break;
      case 'error':
        results.errors.push({ file, error: result.error });
        break;
    }
  });

  // Print results
  console.log('━'.repeat(60));
  console.log('📊 Results:');
  console.log('━'.repeat(60));

  if (fix) {
    if (results.modified.length > 0) {
      console.log(`\n✅ Modified (${results.modified.length} files):`);
      results.modified.forEach((file) => console.log(`   + ${file}`));
    }
  } else {
    if (results.missingHeader.length > 0) {
      console.log(`\n⚠️  Missing header (${results.missingHeader.length} files):`);
      results.missingHeader.forEach((file) => console.log(`   - ${file}`));
    }
  }

  if (results.skipped.length > 0) {
    console.log(`\n⏭️  Skipped (${results.skipped.length} files) - already have headers or empty`);
  }

  if (results.errors.length > 0) {
    console.log(`\n❌ Errors (${results.errors.length} files):`);
    results.errors.forEach(({ file, error }) => console.log(`   ! ${file}: ${error}`));
  }

  console.log('\n' + '━'.repeat(60));
  console.log(`Total: ${files.length} files processed`);
  console.log('━'.repeat(60) + '\n');

  // Exit with error code if issues found in check mode
  if (check && results.missingHeader.length > 0) {
    console.error('❌ Some files are missing license headers!');
    console.error(`Run 'pnpm license:add' to fix\n`);
    process.exit(1);
  }

  if (fix && results.modified.length > 0) {
    console.log('✅ License headers added successfully!\n');
  } else if (check && results.missingHeader.length === 0) {
    console.log('✅ All files have license headers!\n');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { LICENSE_HEADER, hasLicenseHeader, addLicenseToContent };
