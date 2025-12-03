import { GoogleGenAI, Type } from "@google/genai";
import { WorkflowStep, ProjectTemplate } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. Using mock responses.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a structured workflow from a natural language prompt using Gemini.
 */
export const generateWorkflowFromPrompt = async (prompt: string): Promise<WorkflowStep[]> => {
  const ai = getAI();

  if (!ai) {
    // Mock response if no API key
    await new Promise(r => setTimeout(r, 1500));
    return [
      { id: '1', type: 'trigger', name: 'New Lead', description: 'Triggered when a new lead enters the CRM', tool: 'HubSpot' },
      { id: '2', type: 'ai_agent', name: 'Enrich Data', description: 'Research company using Gemini', tool: 'Gemini 2.5 Flash' },
      { id: '3', type: 'action', name: 'Draft Email', description: 'Draft personalized outreach email', tool: 'Gmail' },
      { id: '4', type: 'action', name: 'Notify Slack', description: 'Send notification to sales channel', tool: 'Slack' }
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert AI Automation Architect. Create a structured workflow based on this user request: "${prompt}".
      
      Return a JSON array of steps. Each step should have:
      - id: string
      - type: 'trigger' | 'action' | 'condition' | 'ai_agent'
      - name: string (short title)
      - description: string (what it does)
      - tool: string (optional, e.g., 'Gmail', 'Gemini', 'Notion')
      
      Keep it logical and sequential.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['trigger', 'action', 'condition', 'ai_agent'] },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              tool: { type: Type.STRING }
            },
            required: ['id', 'type', 'name', 'description']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WorkflowStep[];
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of error
    return [
      { id: 'err1', type: 'ai_agent', name: 'Error', description: 'Failed to generate workflow. Please check API key.', tool: 'System' }
    ];
  }
};

/**
 * Generates a monthly summary report for a client based on raw data.
 */
export const generateClientReport = async (clientName: string, metrics: any): Promise<string> => {
    const ai = getAI();
    if (!ai) return "Simulated AI Report: Client health is good. Revenue is stable. Recommended action: Upsell AI Content module.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a brief, professional, 3-sentence executive summary for client "${clientName}" based on these metrics: ${JSON.stringify(metrics)}. The tone should be authoritative but helpful.`,
        });
        return response.text || "No analysis available.";
    } catch (e) {
        return "Failed to generate report.";
    }
}

/**
 * Generates a project template with tasks from a natural language prompt.
 */
export const generateProjectTemplate = async (prompt: string): Promise<Partial<ProjectTemplate>> => {
  const ai = getAI();

  if (!ai) {
    await new Promise(r => setTimeout(r, 1500));
    return {
      name: "AI Generated Template",
      description: "A comprehensive project plan based on your request.",
      category: "Strategy",
      tasks: ["Kickoff Meeting", "Requirement Gathering", "Initial Draft", "Client Review", "Final Delivery"]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a project management template based on this request: "${prompt}".
      
      Return a JSON object with:
      - name: string (Creative project template name)
      - description: string (Short description)
      - category: 'Design' | 'Development' | 'Marketing' | 'Strategy'
      - tasks: string[] (List of 5-8 actionable tasks/milestones)
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Design', 'Development', 'Marketing', 'Strategy'] },
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['name', 'description', 'category', 'tasks']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<ProjectTemplate>;
    }
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      name: "Error Generating Template",
      description: "Please try again later.",
      category: "Strategy",
      tasks: []
    };
  }
};