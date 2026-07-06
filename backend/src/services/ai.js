const axios = require('axios');

/**
 * AI Generation Service for FlowApp
 * Generates Code.gs, index.html, and README.md using Gemini 1.5 Pro.
 */

const fallbackTemplates = {
    crud: {
        backendCode: `// Google Apps Script Backend (Code.gs)
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('FlowApp Generated Database')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSheetData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const data = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    data.push(item);
  }
  return data;
}

function addRecord(record) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => record[header] || '');
  sheet.appendRow(newRow);
  return { success: true, message: 'Record added successfully' };
}`,
        frontendCode: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FlowApp Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Outfit', sans-serif; }
  </style>
</head>
<body class="bg-slate-900 text-white min-h-screen p-6">
  <div class="max-w-4xl mx-auto">
    <header class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Generated Application</h1>
      <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">Active Database Connection</span>
    </header>
    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
      <h2 class="text-xl font-bold mb-4">Manage Items</h2>
      <p class="text-slate-400 mb-6">Database connected via Google Sheets. Create, Read, Update, and Delete entries in real-time.</p>
      <!-- Action buttons & Forms -->
      <button class="bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 rounded-xl font-bold transition-all">Add Record</button>
    </div>
  </div>
</body>
</html>`,
        readme: `# FlowApp CRUD Project
## Setup Instructions
1. Open Google Sheets and create a spreadsheet.
2. Go to **Extensions > Apps Script**.
3. Replace the contents of \`Code.gs\` with the provided backend script.
4. Create an HTML file named \`Index.html\` and paste the frontend code.
5. Click **Deploy > New Deployment > Web App**.
6. Set access to **Anyone** and click **Deploy**.
7. Copy the Web App URL and paste it in the FlowApp settings dashboard.`
    }
};

async function generateFlowAppProject(prompt, options = {}) {
    const apiKey = process.env.GEMINI_API_KEY || '1481f91f635aef0dac25b0502bafb8e1cc0979342bfdef0dd9f9140b9ec671a1';
    const category = options.category || 'Utility';
    const theme = options.theme || 'modern';
    const planType = options.planType || 'lite';

    if (!apiKey) {
        console.warn('⚠️ No GEMINI_API_KEY found, using fallback templates.');
        return fallbackTemplates.crud;
    }

    const systemInstruction = `You are a Senior Fullstack AI Assistant that outputs functional code ready to run on Google Apps Script and Google Sheets.
Generate three specific files in JSON output format:
1. backendCode: Clean Apps Script code (Code.gs) utilizing SpreadsheetApp to read/write data, handling CRUD operations.
2. frontendCode: An interactive, premium HTML/CSS/JS frontend (index.html) built with responsive layout and modern styling. Do not use generic styling. Include custom Tailwind templates, beautiful headers, interactive inputs, and toast alerts.
3. readme: A markdown README.md providing quick deployment guidelines.

Return ONLY a JSON object containing keys: 'backendCode', 'frontendCode', and 'readme'. No other text outside the JSON structure. Use correct JSON escaping.`;

    const userPrompt = `
Generate a Web Application based on this requirement:
Prompt: "${prompt}"
Category: ${category}
Visual Theme: ${theme}
Subscription Tier limits: ${planType} (Lite/Pro/Cloud)

The frontend should be fully styled based on the theme "${theme}". Include forms, list tables, and buttons that hook into Google Apps Script backend functions (using google.script.run for RPC calls). Make the UI feel highly professional, dark mode by default, and responsive.`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: userPrompt }]
            }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        backendCode: { type: "STRING" },
                        frontendCode: { type: "STRING" },
                        readme: { type: "STRING" }
                    },
                    required: ["backendCode", "frontendCode", "readme"]
                }
            }
        });

        const resultText = response.data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(resultText);

        return {
            backendCode: parsed.backendCode,
            frontendCode: parsed.frontendCode,
            readme: parsed.readme,
            rawResponse: response.data
        };
    } catch (error) {
        console.error('❌ Gemini generation error:', error.response?.data || error.message);
        throw new Error('Failed to generate application through AI: ' + (error.response?.data?.error?.message || error.message));
    }
}

module.exports = {
    generateFlowAppProject
};
