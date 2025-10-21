import { GoogleGenAI } from "@google/genai";
import { Ticket } from '../types';

// The API key is securely provided by the environment.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    // This error will be visible in the browser console if the key is missing.
    console.error("API_KEY is not set. Please ensure it is configured in the environment.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

function formatTicketsForPrompt(tickets: Ticket[]): string {
    return tickets.map(ticket => `
- Date: ${ticket.connectDate}
- Partner: ${ticket.partnerName} (${ticket.partnerId})
- Region: ${ticket.region}
- Status: ${ticket.currentStatus}
- Area: ${ticket.discussionArea} -> ${ticket.discussionSubArea}
- Action Taken: ${ticket.actionTaken}
    `).join('\n');
}

export const generateReport = async (tickets: Ticket[]): Promise<string> => {
    if (!apiKey) {
        throw new Error("API Key is not configured. Please contact the administrator.");
    }
    if (tickets.length === 0) {
        return "No activities to report.";
    }

    const formattedTickets = formatTicketsForPrompt(tickets);
    
    const prompt = `
        As an expert analyst, generate a concise and professional summary report for a management team based on the following daily activity logs.
        The report should be structured with the following sections:
        1.  **Overall Summary:** A brief, high-level overview of the day's activities.
        2.  **Key Accomplishments:** Highlight completed tasks, resolved issues, and major progress points.
        3.  **Items in Progress:** List tasks that are currently open or pending and require further action.
        4.  **Action Items for Management (if any):** Clearly state any points that require management's attention or decision.

        Use clear headings, bullet points, and a professional tone.

        Here are the activity logs:
        ${formattedTickets}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate report from Gemini API.");
    }
};

export const generateWeeklySnapshot = async (tickets: Ticket[]): Promise<string> => {
    if (!apiKey) {
        throw new Error("API Key is not configured. Please contact the administrator.");
    }
    if (tickets.length === 0) {
        return "No activities recorded in the last 7 days.";
    }

    const formattedTickets = formatTicketsForPrompt(tickets);
    
    const prompt = `
        Analyze the following activity logs from the past 7 days and generate a very brief, high-level snapshot for a manager.
        Focus on the overall trend and any standout items. Use a conversational but professional tone.
        Keep it to 2-3 sentences.

        Activity logs:
        ${formattedTickets}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for snapshot:", error);
        throw new Error("Failed to generate weekly snapshot.");
    }
};