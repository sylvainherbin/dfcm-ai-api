// Fichier : api/chatbot.js (Version finale polyvalente)

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

export default async function handler(request, response) {
  // Gérer la poignée de main CORS (essentiel)
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.status(204).end();
    return;
  }
  
  // Ajouter les headers pour la requête POST elle-même
  response.setHeader('Access-Control-Allow-Origin', '*');
  
  // Initialiser Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Votre nom de modèle

  // --- Logique de Aiguillage ---
  // On regarde si on a reçu un "message" ou un "scriptName"
  
  const body = request.body;

  // --- CAS N°1 : C'EST UNE DEMANDE D'EXÉCUTION DE SCRIPT ---
  if (body && body.scriptName) {
    try {
      const { scriptName } = body;
      console.log(`[chatbot.js] Reçu demande SCRIPT : ${scriptName}`);

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
      console.error('[chatbot.js SCRIPT ERROR]', error);
      return response.status(500).json({ success: false, error: 'Script execution failed: ' + error.message });
    }
  }

  // --- CAS N°2 : C'EST UNE DEMANDE POUR LE CHATBOT ---
  if (body && body.message) {
    try {
      const { message } = body;
      console.log(`[chatbot.js] Reçu demande CHAT : "${message}"`);
      
      // Ici, on remet votre logique de chat existante
      const chat = model.startChat({
          history: [ /* ... TOUT VOTRE LONG HISTORIQUE DE PROMPT ... */ ],
          model: "gemini-2.5-flash", // J'ai vu que vous aviez un nom de modèle incohérent, j'ai uniformisé
      });

      const result = await chat.sendMessage(message);
      const geminiResponse = await result.response.text();
      
      return response.status(200).json({ reply: geminiResponse });

    } catch (error) {
      console.error('[chatbot.js CHAT ERROR]', error);
      return response.status(500).json({ error: 'Failed to get chat response', details: error.message });
    }
  }

  // --- CAS D'ERREUR : La requête est invalide ---
  return response.status(400).json({ error: 'Invalid request body. Expecting "message" or "scriptName".' });
}
