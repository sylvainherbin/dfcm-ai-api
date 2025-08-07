// Fichier : api/execute-script.js
// Version finale qui inclut la gestion CORS de votre chatbot.js fonctionnel.

import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
  // --- ÉTAPE 1 : LA POIGNÉE DE MAIN CORS (la partie qui manquait) ---
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.status(204).end();
    return;
  }

  // On ajoute aussi les headers pour la requête POST elle-même
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // --- ÉTAPE 2 : LA LOGIQUE D'EXÉCUTION DU SCRIPT ---
  try {
    // Initialiser Gemini avec le bon modèle (le même que votre chatbot)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Récupérer le nom du script depuis la requête
    const { scriptName } = request.body;

    // Liste de sécurité des scripts autorisés
    const allowedScripts = [
      'validate_bao_hz.py',
      'SNIa.py',
      'CMB.py',
      'galaxy_2pcf_check.py',
      'cluster_deficit_calc.py'
    ];

    if (!scriptName || !allowedScripts.includes(scriptName)) {
      return response.status(400).json({ success: false, error: 'Invalid or unauthorized script name.' });
    }

    // Lire le contenu du fichier Python
    const scriptPath = path.join(process.cwd(), 'scripts', scriptName);
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    console.log(`[execute-script] Fichier lu : ${scriptName}. Envoi à Gemini...`);

    // Demander à Gemini d'exécuter le script
    const prompt = `Exécute ce script Python et retourne unicamente la sortie texte brute (stdout), sans aucun commentaire additionnel de ta part:\n\n\`\`\`python\n${scriptContent}\n\`\`\``;
    
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response.text();
    
    console.log(`[execute-script] Réponse reçue de Gemini.`);

    // Renvoyer la réponse de Gemini au site web
    return response.status(200).json({ success: true, output: geminiResponse });

  } catch (error) {
    console.error('[execute-script] ERREUR:', error);
    return response.status(500).json({ 
      success: false, 
      error: 'An internal server error occurred. ' + error.message 
    });
  }
}
