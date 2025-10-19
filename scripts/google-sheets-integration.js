/**
 * Comprehensive Image Audit and Mapping System
 * Google Sheets Integration & CSV Export
 * 
 * This script integrates with Google Sheets API for easy review and collaboration,
 * and provides enhanced CSV export functionality.
 */

const fs = require('fs').promises;
const path = require('path');
const { google } = require('googleapis');

class GoogleSheetsIntegration {
  constructor() {
    this.outputDir = path.join(process.cwd(), 'audit-results');
    this.sheets = null;
    this.auth = null;
    this.spreadsheetId = null;
    
    // Google Sheets configuration
    this.sheetsConfig = {
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      credentials: null // Will be loaded from environment or file
    };
  }

  async initialize() {
    console.log('🚀 Initializing Google Sheets Integration...');
    
    try {
      // Try to load credentials from environment or file
      await this.loadCredentials();
      
      // Authenticate with Google Sheets API
      await this.authenticateGoogleSheets();
      
      console.log('✅ Google Sheets API authenticated successfully');
      
    } catch (error) {
      console.log('⚠️  Google Sheets API not available. Will export CSV files only.');
      console.log('💡 To enable Google Sheets integration:');
      console.log('   1. Create a Google Cloud Project');
      console.log('   2. Enable Google Sheets API');
      console.log('   3. Create service account credentials');
      console.log('   4. Save credentials as google-credentials.json');
    }
  }

  async loadCredentials() {
    // Try multiple credential sources
    const credentialSources = [
      process.env.GOOGLE_SHEETS_CREDENTIALS, // Environment variable
      path.join(process.cwd(), 'google-credentials.json'), // Local file
      path.join(process.cwd(), 'credentials', 'google-sheets.json') // Credentials folder
    ];
    
    for (const source of credentialSources) {
      try {
        if (source && source.startsWith('{')) {
          // JSON string from environment
          this.sheetsConfig.credentials = JSON.parse(source);
          return;
        } else if (source) {
          // File path
          const credentialsContent = await fs.readFile(source, 'utf8');
          this.sheetsConfig.credentials = JSON.parse(credentialsContent);
          return;
        }
      } catch (error) {
        // Continue to next source
      }
    }
    
    throw new Error('No valid Google Sheets credentials found');
  }

  async authenticateGoogleSheets() {
    if (!this.sheetsConfig.credentials) {
      throw new Error('No credentials available');
    }
    
    this.auth = new google.auth.GoogleAuth({
      credentials: this.sheetsConfig.credentials,
      scopes: this.sheetsConfig.scopes
    });
    
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async createComprehensiveSpreadsheet() {
    console.log('\n📊 Creating comprehensive Google Spreadsheet...');
    
    if (!this.sheets) {
      console.log('⚠️  Google Sheets not available. Skipping spreadsheet creation.');
      return null;
    }
    
    try {
      // Create new spreadsheet
      const spreadsheet = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: `Image Audit Report - ${new Date().toISOString().split('T')[0]}`,
            locale: 'en_US',
            timeZone: 'America/New_York'
          },
          sheets: [
            {
              properties: {
                title: 'New Images Inventory',
                gridProperties: { rowCount: 1000, columnCount: 15 }
              }
            },
            {
              properties: {
                title: 'Missing Images Audit',
                gridProperties: { rowCount: 1000, columnCount: 12 }
              }
            },
            {
              properties: {
                title: 'Mapping Recommendations',
                gridProperties: { rowCount: 1000, columnCount: 13 }
              }
            },
            {
              properties: {
                title: 'Summary Dashboard',
                gridProperties: { rowCount: 50, columnCount: 10 }
              }
            }
          ]
        }
      });
      
      this.spreadsheetId = spreadsheet.data.spreadsheetId;
      console.log(`✅ Spreadsheet created: ${this.spreadsheetId}`);
      console.log(`🔗 URL: https://docs.google.com/spreadsheets/d/${this.spreadsheetId}`);
      
      // Populate all sheets
      await this.populateInventorySheet();
      await this.populateMissingImagesSheet();
      await this.populateMappingSheet();
      await this.populateSummaryDashboard();
      
      // Format sheets
      await this.formatSpreadsheet();
      
      return this.spreadsheetId;
      
    } catch (error) {
      console.error('❌ Error creating Google Spreadsheet:', error.message);
      return null;
    }
  }

  async populateInventorySheet() {
    console.log('📋 Populating New Images Inventory sheet...');
    
    try {
      const csvPath = path.join(this.outputDir, 'new-images-inventory.csv');
      const csvContent = await fs.readFile(csvPath, 'utf8');
      const data = this.parseCSVToArray(csvContent);
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'New Images Inventory!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: data
        }
      });
      
      console.log('✅ Inventory sheet populated');
      
    } catch (error) {
      console.error('❌ Error populating inventory sheet:', error.message);
    }
  }

  async populateMissingImagesSheet() {
    console.log('📋 Populating Missing Images Audit sheet...');
    
    try {
      const csvPath = path.join(this.outputDir, 'missing-images-audit.csv');
      const csvContent = await fs.readFile(csvPath, 'utf8');
      const data = this.parseCSVToArray(csvContent);
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Missing Images Audit!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: data
        }
      });
      
      console.log('✅ Missing images sheet populated');
      
    } catch (error) {
      console.error('❌ Error populating missing images sheet:', error.message);
    }
  }

  async populateMappingSheet() {
    console.log('📋 Populating Mapping Recommendations sheet...');
    
    try {
      const csvPath = path.join(this.outputDir, 'image-mapping-recommendations.csv');
      const csvContent = await fs.readFile(csvPath, 'utf8');
      const data = this.parseCSVToArray(csvContent);
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Mapping Recommendations!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: data
        }
      });
      
      console.log('✅ Mapping recommendations sheet populated');
      
    } catch (error) {
      console.error('❌ Error populating mapping sheet:', error.message);
    }
  }

  async populateSummaryDashboard() {
    console.log('📊 Creating Summary Dashboard...');
    
    try {
      // Load summary data
      const inventorySummaryPath = path.join(this.outputDir, 'inventory-summary.json');
      const missingSummaryPath = path.join(this.outputDir, 'missing-images-summary.json');
      const mappingSummaryPath = path.join(this.outputDir, 'mapping-summary.json');
      
      const inventorySummary = JSON.parse(await fs.readFile(inventorySummaryPath, 'utf8'));
      const missingSummary = JSON.parse(await fs.readFile(missingSummaryPath, 'utf8'));
      const mappingSummary = JSON.parse(await fs.readFile(mappingSummaryPath, 'utf8'));
      
      // Create dashboard data
      const dashboardData = [
        ['Image Audit Summary Dashboard', '', '', '', '', '', '', '', ''],
        ['Generated on:', new Date().toISOString(), '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['📊 INVENTORY OVERVIEW', '', '', '', '', '', '', '', ''],
        ['Total Available Images:', inventorySummary.total_images, '', '', '', '', '', '', ''],
        ['Total Size (MB):', inventorySummary.total_size_mb, '', '', '', '', '', '', ''],
        ['Average SEO Score:', inventorySummary.average_seo_score, '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['📋 CATEGORIES BREAKDOWN', '', '', '', '', '', '', '', ''],
        ...Object.entries(inventorySummary.categories).map(([category, count]) => [category, count, '', '', '', '', '', '', '']),
        ['', '', '', '', '', '', '', '', ''],
        ['❌ MISSING IMAGES OVERVIEW', '', '', '', '', '', '', '', ''],
        ['Total Missing Images:', missingSummary.total_issues, '', '', '', '', '', '', ''],
        ['High Priority Issues:', missingSummary.by_priority.High || 0, '', '', '', '', '', '', ''],
        ['Medium Priority Issues:', missingSummary.by_priority.Medium || 0, '', '', '', '', '', '', ''],
        ['Low Priority Issues:', missingSummary.by_priority.Low || 0, '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['🎯 MAPPING RESULTS', '', '', '', '', '', '', '', ''],
        ['Coverage Percentage:', `${mappingSummary.coverage_percentage}%`, '', '', '', '', '', '', ''],
        ['High Confidence Matches:', mappingSummary.matching_results.high_confidence, '', '', '', '', '', '', ''],
        ['Medium Confidence Matches:', mappingSummary.matching_results.medium_confidence, '', '', '', '', '', '', ''],
        ['Auto-Replace Ready:', mappingSummary.recommendations.auto_replace, '', '', '', '', '', '', ''],
        ['Review Required:', mappingSummary.recommendations.review_and_replace, '', '', '', '', '', '', ''],
        ['Manual Review Needed:', mappingSummary.recommendations.manual_review, '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['🚀 NEXT STEPS', '', '', '', '', '', '', '', ''],
        ['1. Review high-priority replacements', '', '', '', '', '', '', '', ''],
        ['2. Implement auto-replace recommendations', '', '', '', '', '', '', '', ''],
        ['3. Manually verify medium-confidence matches', '', '', '', '', '', '', '', ''],
        ['4. Create new images for manual review items', '', '', '', '', '', '', '', ''],
        ['5. Test all pages after implementation', '', '', '', '', '', '', '', '']
      ];
      
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Summary Dashboard!A1',
        valueInputOption: 'RAW',
        requestBody: {
          values: dashboardData
        }
      });
      
      console.log('✅ Summary dashboard created');
      
    } catch (error) {
      console.error('❌ Error creating summary dashboard:', error.message);
    }
  }

  async formatSpreadsheet() {
    console.log('🎨 Formatting spreadsheet...');
    
    try {
      const requests = [
        // Format headers for all sheets
        {
          repeatCell: {
            range: {
              sheetId: 0, // New Images Inventory
              startRowIndex: 0,
              endRowIndex: 1
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.6, blue: 0.2 },
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)'
          }
        },
        {
          repeatCell: {
            range: {
              sheetId: 1, // Missing Images Audit
              startRowIndex: 0,
              endRowIndex: 1
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.8, green: 0.2, blue: 0.2 },
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)'
          }
        },
        {
          repeatCell: {
            range: {
              sheetId: 2, // Mapping Recommendations
              startRowIndex: 0,
              endRowIndex: 1
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 },
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }
              }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)'
          }
        },
        // Auto-resize columns
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 15
            }
          }
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 1,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 12
            }
          }
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 2,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 13
            }
          }
        }
      ];
      
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: { requests }
      });
      
      console.log('✅ Spreadsheet formatted');
      
    } catch (error) {
      console.error('❌ Error formatting spreadsheet:', error.message);
    }
  }

  parseCSVToArray(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const data = [];
    
    for (const line of lines) {
      const row = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++; // Skip next quote
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          row.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      
      row.push(current); // Add last value
      data.push(row);
    }
    
    return data;
  }

  async exportEnhancedCSVs() {
    console.log('\n📄 Exporting enhanced CSV files...');
    
    // Create enhanced versions with additional metadata
    await this.createEnhancedInventoryCSV();
    await this.createEnhancedMissingImagesCSV();
    await this.createEnhancedMappingCSV();
    await this.createMasterSummaryCSV();
    
    console.log('✅ Enhanced CSV files exported');
  }

  async createEnhancedInventoryCSV() {
    try {
      const originalPath = path.join(this.outputDir, 'new-images-inventory.csv');
      const enhancedPath = path.join(this.outputDir, 'enhanced-new-images-inventory.csv');
      
      const originalContent = await fs.readFile(originalPath, 'utf8');
      
      // Add metadata header
      const metadata = [
        '# Enhanced New Images Inventory Report',
        `# Generated: ${new Date().toISOString()}`,
        `# Total Images Analyzed: ${originalContent.split('\n').length - 1}`,
        '# This file contains comprehensive metadata for all available images',
        '#',
        ''
      ].join('\n');
      
      const enhancedContent = metadata + originalContent;
      await fs.writeFile(enhancedPath, enhancedContent, 'utf8');
      
      console.log('📄 Enhanced inventory CSV created');
      
    } catch (error) {
      console.error('❌ Error creating enhanced inventory CSV:', error.message);
    }
  }

  async createEnhancedMissingImagesCSV() {
    try {
      const originalPath = path.join(this.outputDir, 'missing-images-audit.csv');
      const enhancedPath = path.join(this.outputDir, 'enhanced-missing-images-audit.csv');
      
      const originalContent = await fs.readFile(originalPath, 'utf8');
      
      // Add metadata header
      const metadata = [
        '# Enhanced Missing Images Audit Report',
        `# Generated: ${new Date().toISOString()}`,
        `# Total Issues Found: ${originalContent.split('\n').length - 1}`,
        '# This file contains all broken, missing, and placeholder images',
        '#',
        ''
      ].join('\n');
      
      const enhancedContent = metadata + originalContent;
      await fs.writeFile(enhancedPath, enhancedContent, 'utf8');
      
      console.log('📄 Enhanced missing images CSV created');
      
    } catch (error) {
      console.error('❌ Error creating enhanced missing images CSV:', error.message);
    }
  }

  async createEnhancedMappingCSV() {
    try {
      const originalPath = path.join(this.outputDir, 'image-mapping-recommendations.csv');
      const enhancedPath = path.join(this.outputDir, 'enhanced-image-mapping-recommendations.csv');
      
      const originalContent = await fs.readFile(originalPath, 'utf8');
      
      // Add metadata header
      const metadata = [
        '# Enhanced Image Mapping Recommendations Report',
        `# Generated: ${new Date().toISOString()}`,
        `# Total Mappings: ${originalContent.split('\n').length - 1}`,
        '# This file contains intelligent matching recommendations',
        '# Confidence Scores: 80+ = Auto-replace, 50-79 = Review, <50 = Manual',
        '#',
        ''
      ].join('\n');
      
      const enhancedContent = metadata + originalContent;
      await fs.writeFile(enhancedPath, enhancedContent, 'utf8');
      
      console.log('📄 Enhanced mapping CSV created');
      
    } catch (error) {
      console.error('❌ Error creating enhanced mapping CSV:', error.message);
    }
  }

  async createMasterSummaryCSV() {
    try {
      // Load all summary data
      const inventorySummaryPath = path.join(this.outputDir, 'inventory-summary.json');
      const missingSummaryPath = path.join(this.outputDir, 'missing-images-summary.json');
      const mappingSummaryPath = path.join(this.outputDir, 'mapping-summary.json');
      
      const inventorySummary = JSON.parse(await fs.readFile(inventorySummaryPath, 'utf8'));
      const missingSummary = JSON.parse(await fs.readFile(missingSummaryPath, 'utf8'));
      const mappingSummary = JSON.parse(await fs.readFile(mappingSummaryPath, 'utf8'));
      
      // Create master summary CSV
      const csvData = [
        ['Metric', 'Value', 'Category', 'Notes'],
        ['Total Available Images', inventorySummary.total_images, 'Inventory', 'Images in seo-optimized directory'],
        ['Total Size (MB)', inventorySummary.total_size_mb, 'Inventory', 'Combined size of all images'],
        ['Average SEO Score', inventorySummary.average_seo_score, 'Inventory', 'Based on filename and content analysis'],
        ['Total Missing Images', missingSummary.total_issues, 'Missing', 'Broken, missing, or placeholder images'],
        ['High Priority Issues', missingSummary.by_priority.High || 0, 'Missing', 'Critical pages with missing images'],
        ['Medium Priority Issues', missingSummary.by_priority.Medium || 0, 'Missing', 'Important pages with missing images'],
        ['Low Priority Issues', missingSummary.by_priority.Low || 0, 'Missing', 'Less critical missing images'],
        ['Coverage Percentage', `${mappingSummary.coverage_percentage}%`, 'Mapping', 'Percentage of missing images with good matches'],
        ['Auto-Replace Ready', mappingSummary.recommendations.auto_replace, 'Mapping', 'High confidence matches ready for implementation'],
        ['Review Required', mappingSummary.recommendations.review_and_replace, 'Mapping', 'Medium confidence matches needing review'],
        ['Manual Review Needed', mappingSummary.recommendations.manual_review, 'Mapping', 'Low confidence or no matches found']
      ];
      
      const csvContent = csvData.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      const masterPath = path.join(this.outputDir, 'master-summary.csv');
      await fs.writeFile(masterPath, csvContent, 'utf8');
      
      console.log('📄 Master summary CSV created');
      
    } catch (error) {
      console.error('❌ Error creating master summary CSV:', error.message);
    }
  }

  async generateFinalReport() {
    console.log('\n📋 Generating final comprehensive report...');
    
    const reportPath = path.join(this.outputDir, 'FINAL-AUDIT-REPORT.md');
    
    const report = `# 🎯 Comprehensive Image Audit Report

## 📊 Executive Summary

This report provides a complete analysis of the image audit and mapping system for the La Belle Vie website.

### 🗂️ Generated Files

#### Core Audit Files
- \`new-images-inventory.csv\` - Complete catalog of available images
- \`missing-images-audit.csv\` - Pages needing image updates  
- \`image-mapping-recommendations.csv\` - Suggested image placements

#### Enhanced Reports
- \`enhanced-new-images-inventory.csv\` - Inventory with metadata
- \`enhanced-missing-images-audit.csv\` - Missing images with context
- \`enhanced-image-mapping-recommendations.csv\` - Detailed recommendations

#### Summary Files
- \`master-summary.csv\` - Key metrics overview
- \`inventory-summary.json\` - Detailed inventory statistics
- \`missing-images-summary.json\` - Missing images analysis
- \`mapping-summary.json\` - Matching results summary
- \`implementation-guide.json\` - Step-by-step implementation plan

### 🔗 Google Sheets Integration

${this.spreadsheetId ? 
  `✅ **Spreadsheet Created**: https://docs.google.com/spreadsheets/d/${this.spreadsheetId}

The spreadsheet contains four sheets:
1. **New Images Inventory** - All available images with metadata
2. **Missing Images Audit** - Broken/missing image references
3. **Mapping Recommendations** - Intelligent matching suggestions
4. **Summary Dashboard** - Key metrics and next steps` :
  `⚠️ **Google Sheets integration not available**. Please review CSV files for data analysis.`}

### 🚀 Next Steps

1. **Review High-Priority Replacements** - Implement auto-replace recommendations immediately
2. **Verify Medium-Priority Matches** - Manually review before implementing
3. **Address Manual Review Items** - Create or source new images as needed
4. **Update Alt Text** - Use suggested alt text from recommendations
5. **Test Implementation** - Verify all pages work correctly after changes
6. **Performance Audit** - Ensure no regressions in page load times

### 📞 Support

For questions about this audit or implementation assistance, refer to the implementation guide or review the detailed CSV files.

---
*Report generated on ${new Date().toISOString()}*
`;

    await fs.writeFile(reportPath, report, 'utf8');
    console.log(`📋 Final report saved to: ${reportPath}`);
  }
}

// Main execution
async function runGoogleSheetsIntegration() {
  const integration = new GoogleSheetsIntegration();
  
  try {
    await integration.initialize();
    
    // Export enhanced CSV files
    await integration.exportEnhancedCSVs();
    
    // Create Google Spreadsheet if possible
    const spreadsheetId = await integration.createComprehensiveSpreadsheet();
    
    // Generate final report
    await integration.generateFinalReport();
    
    console.log('\n🎉 Google Sheets Integration completed successfully!');
    console.log('📁 All files saved in: audit-results/');
    
    if (spreadsheetId) {
      console.log(`🔗 Google Spreadsheet: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
    }
    
  } catch (error) {
    console.error('❌ Error during Google Sheets integration:', error);
  }
}

// Export for use in other scripts
module.exports = { GoogleSheetsIntegration };

// Run if called directly
if (require.main === module) {
  runGoogleSheetsIntegration();
}
