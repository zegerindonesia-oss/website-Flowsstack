const { workflow, node, trigger, languageModel, tool, newCredential, fromAi } = require('@n8n/workflow-sdk');

/**
 * HaloFlow AI Agent Workflow
 * This workflow sets up an advanced AI assistant tailored for business WhatsApp interactions.
 * It uses a Webhook to receive messages (which would connect to your WhatsApp API like WAHA or Meta),
 * processes the message through a LangChain Agent equipped with business tools, and outputs a response.
 */

// 1. Trigger: Webhook to receive incoming WhatsApp messages
const webhookTrigger = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: { 
    name: 'WhatsApp Webhook (Incoming)', 
    parameters: {
      httpMethod: 'POST',
      path: 'haloflow-wa-incoming',
      responseMode: 'onReceived'
    },
    position: [200, 300] 
  },
  output: [{
    body: {
      from: "6281234567890",
      message: "Halo min, promo paket starter masih ada?",
      timestamp: 1684392000
    }
  }]
});

// 2. Format Input Node: Prepare message for AI
const formatInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Format Message',
    parameters: {
      assignments: {
        assignments: [
          { id: '1', name: 'user_phone', value: '={{ $json.body.from }}', type: 'string' },
          { id: '2', name: 'user_message', value: '={{ $json.body.message }}', type: 'string' }
        ]
      }
    },
    position: [400, 300]
  },
  output: [{ user_phone: "6281234567890", user_message: "Halo min, promo paket starter masih ada?" }]
});

// 3. AI Language Model (OpenAI gpt-4o or similar)
const openAiModel = languageModel({
  type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
  version: 1.3,
  config: { 
    name: 'HaloFlow OpenAI Model', 
    parameters: {
      model: 'gpt-4o',
      temperature: 0.5
    },
    credentials: { openAiApi: newCredential('OpenAI') },
    position: [600, 500] 
  }
});

// 4. Tools for the AI (Knowledge Base retrieval, Product search, etc.)
// In a real scenario, this could be a Vector Store Tool or custom HTTP requests to FlowStack DB.
const checkPromoTool = tool({
  type: '@n8n/n8n-nodes-langchain.toolHttpRequest',
  version: 1.1,
  config: {
    name: 'CheckPromoDB',
    description: 'Call this tool to check if a specific product promo is still active.',
    parameters: {
      url: 'https://api.flowstack.id/v1/promos',
      method: 'GET',
      queryParameters: {
        parameters: [
          { name: 'keyword', value: '={{ $fromAi("query", "The product name to check promo for") }}' }
        ]
      }
    },
    position: [750, 400]
  }
});

// Google Drive Document Retrieval Tool (Knowledge Base)
const searchKnowledgeBaseTool = tool({
  type: '@n8n/n8n-nodes-langchain.toolGoogleDrive',
  version: 1.0,
  config: {
    name: 'SearchKnowledgeBase',
    description: 'Call this tool to search through the user Google Drive documents for business information, pricing, and FAQs.',
    parameters: {
      operation: 'search',
      query: '={{ $fromAi("search_query", "The specific information you are looking for") }}',
      folderId: '={{ $json.user_settings.gdrive_folder_id }}'
    },
    position: [750, 600]
  }
});

// 5. The LangChain Agent
const aiAgent = node({
  type: '@n8n/n8n-nodes-langchain.agent',
  version: 3.1,
  config: {
    name: 'HaloFlow Business Agent',
    parameters: { 
      promptType: 'define', 
      text: '={{ $json.user_settings.systemPrompt }} \n\nYou have access to Google Drive documents for knowledge base. If asked about business info, use the SearchKnowledgeBase tool.',
      options: {
        systemMessage: "Always respond in the user's language (primarily Indonesian)."
      }
    },
    subnodes: { 
      model: openAiModel, 
      tools: [checkPromoTool, searchKnowledgeBaseTool] 
    },
    position: [600, 300]
  },
  output: [{ output: 'Halo kak! 👋 Betul, paket Starter sedang promo spesial bulan ini.' }]
});

// 6. Send Reply via WhatsApp (HTTP Request to WA API / WAHA)
const sendReply = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.3,
  config: {
    name: 'Send WhatsApp Reply',
    parameters: {
      method: 'POST',
      url: 'https://waha.yourdomain.com/api/sendText',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'Content-Type', value: 'application/json' },
          { name: 'Authorization', value: 'Bearer YOUR_WAHA_TOKEN' }
        ]
      },
      sendBody: true,
      bodyParameters: {
        parameters: [
          { name: 'chatId', value: '={{ $(\"Format Message\").item.json.user_phone }}@c.us' },
          { name: 'text', value: '={{ $json.output }}' },
          { name: 'session', value: '={{ $json.user_settings.waha_session_id }}' } // Dynamic Session Routing
        ]
      }
    },
    position: [850, 300]
  },
  output: [{ success: true }]
});

// 7. Compose and Export Workflow
export default workflow('haloflow-ai-agent', 'HaloFlow AI Agent (Antigravity+n8n)')
  .add(webhookTrigger)
  .to(formatInput)
  .to(aiAgent)
  .to(sendReply);
