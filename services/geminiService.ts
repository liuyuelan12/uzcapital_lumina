/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are the AI Investment Analyst for UZ Capital.
      
      Context:
      UZ Capital is a premier Web3 Venture Capital firm and Incubator.
      Focus areas: Asset Management, DeFi, Infrastructure, Decentralized Identity, and GameFi.
      Mission: Architecting the decentralized horizon by incubating high-potential Web3 startups from zero to one.
      
      Tone: Professional, insightful, forward-thinking, sophisticated. Use terms like "Alpha", "Yield", "Scalability", "Sovereignty".
      
      Key Info:
      - Services: Strategic Incubation, Seed Funding, Asset Management (Liquidity Provision).
      - Portfolio highlights (fictional): Nexus Protocol (DeFi), CipherChain (L1), MetaVault.
      
      If asked about investment advice, clarify you are an AI assistant and this is not financial advice.
      Keep responses concise (under 60 words) and business-oriented.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Analyst Systems Offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Analysis incomplete.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection to market data lost. Try again later.";
  }
};