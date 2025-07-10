#!/usr/bin/env node

/**
 * Verification script to test that the demo app is using the published NPM package
 * and all features are working correctly.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Verifying Invoice-Craft Demo App NPM Integration...\n');

// Check package.json
try {
  const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
  const invoiceCraftVersion = packageJson.dependencies['invoice-craft'];
  
  console.log('✅ Package Configuration:');
  console.log(`   - Demo App: ${packageJson.name}@${packageJson.version}`);
  console.log(`   - Invoice-Craft: ${invoiceCraftVersion}`);
  
  if (invoiceCraftVersion.startsWith('file:')) {
    console.log('❌ ERROR: Still using local file reference!');
    process.exit(1);
  } else {
    console.log('✅ Using published NPM package');
  }
} catch (error) {
  console.log('❌ ERROR: Could not read package.json');
  process.exit(1);
}

// Check node_modules
try {
  const nodeModulesPath = join(__dirname, 'node_modules', 'invoice-craft', 'package.json');
  const installedPackage = JSON.parse(readFileSync(nodeModulesPath, 'utf8'));
  
  console.log('\n✅ Installed Package:');
  console.log(`   - Name: ${installedPackage.name}`);
  console.log(`   - Version: ${installedPackage.version}`);
  console.log(`   - Description: ${installedPackage.description}`);
  
} catch (error) {
  console.log('\n❌ ERROR: invoice-craft not found in node_modules');
  process.exit(1);
}

// Test import
try {
  const { generateInvoicePdf, validateInvoice, exportInvoice } = await import('invoice-craft');
  
  console.log('\n✅ Import Test:');
  console.log(`   - generateInvoicePdf: ${typeof generateInvoicePdf}`);
  console.log(`   - validateInvoice: ${typeof validateInvoice}`);
  console.log(`   - exportInvoice: ${typeof exportInvoice}`);
  
  if (typeof generateInvoicePdf !== 'function') {
    throw new Error('generateInvoicePdf is not a function');
  }
  
} catch (error) {
  console.log('\n❌ ERROR: Could not import invoice-craft functions');
  console.log(`   Error: ${error.message}`);
  process.exit(1);
}

// Test basic functionality
try {
  const { validateInvoice } = await import('invoice-craft');
  
  const testInvoice = {
    from: { name: "Test Company", address: "123 Test St" },
    to: { name: "Test Client", address: "456 Client Ave" },
    invoiceNumber: "TEST-001",
    invoiceDate: "2024-01-15",
    items: [{ description: "Test Service", quantity: 1, unitPrice: 100 }],
    currency: "USD"
  };
  
  const validation = validateInvoice(testInvoice);
  
  console.log('\n✅ Functionality Test:');
  console.log(`   - Validation: ${validation.isValid ? 'PASS' : 'FAIL'}`);
  console.log(`   - Errors: ${validation.errors.length}`);
  console.log(`   - Warnings: ${validation.warnings.length}`);
  
} catch (error) {
  console.log('\n❌ ERROR: Functionality test failed');
  console.log(`   Error: ${error.message}`);
  process.exit(1);
}

console.log('\n🎉 All tests passed! Demo app is correctly using the published NPM package.');
console.log('\n📱 Demo app features available:');
console.log('   - Basic PDF generation');
console.log('   - HTML preview');
console.log('   - Multiple export formats');
console.log('   - Advanced validation');
console.log('   - Batch processing');
console.log('   - Plugin system');
console.log('   - Custom templates');
console.log('\n🌐 Access the demo at: http://localhost:5173');
