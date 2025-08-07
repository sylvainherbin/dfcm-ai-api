// Fichier : api/chatbot.js (Version finale avec aiguillage corrigé)

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

export default async function handler(request, response) {
  // Gérer la poignée de main CORS (identique, ne change pas)
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.status(204).end();
    return;
  }
  response.setHeader('Access-Control-Allow-Origin', '*');

  // --- Logique d'aiguillage corrigée et robuste ---
  const body = request.body;

  // CAS N°1 : C'EST UNE DEMANDE D'EXÉCUTION DE SCRIPT
  if (body && body.scriptName) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const { scriptName } = body;
      console.log(`[AIGUILLAGE OK -> SCRIPT] Reçu demande pour : ${scriptName}`);

      const allowedScripts = ['validate_bao_hz.py', 'SNIa.py', 'CMB.py', 'galaxy_2pcf_check.py', 'cluster_deficit_calc.py'];
      if (!allowedScripts.includes(scriptName)) {
        return response.status(400).json({ success: false, error: 'Invalid or unauthorized script name.' });
      }

      const scriptPath = path.join(process.cwd(), 'scripts', scriptName);
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      
      const prompt = `Exécute ce script Python et retourne uniquement la sortie texte brute (stdout), sans aucun commentaire additionnel de ta part:\n\n\`\`\`python\n${scriptContent}\n\`\`\``;
      const result = await model.generateContent(prompt);
      const geminiResponse = await result.response.text();

      return response.status(200).json({ success: true, output: geminiResponse });

    } catch (error) {
      console.error('[SCRIPT ERROR]', error);
      return response.status(500).json({ success: false, error: 'Script execution failed: ' + error.message });
    }
  } 
  // CAS N°2 : C'EST UNE DEMANDE POUR LE CHATBOT
  else if (body && body.message) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const { message } = body;
      console.log(`[AIGUILLAGE OK -> CHAT] Reçu demande : "${message}"`);
      
      const chat = model.startChat({
          history: [ /* ... Remettez votre long historique de prompt ici ... */ ],
      });

      const result = await chat.sendMessage(message);
      const geminiResponse = await result.response.text();
      
      return response.status(200).json({ reply: geminiResponse });

    } catch (error) {
      console.error('[CHAT ERROR]', error);
      return response.status(500).json({ error: 'Failed to get chat response', details: error.message });
    }
  } 
  // CAS N°3 : La requête est invalide
  else {
    return response.status(400).json({ error: 'Invalid request body. Expecting "message" or "scriptName".' });
  }
}
