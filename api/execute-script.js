// Fichier : api/execute-script.js
// Version corrigée qui réutilise votre configuration Gemini existante.

import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

// === Initialisation (comme dans votre chatbot.js) ===
// Le code réutilise la clé API que vous avez déjà configurée dans Vercel.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ou le modèle que vous utilisez
// =======================================================


// La fonction handler qui fait tout le travail pour ce nouvel endpoint
export default async function handler(req, res) {
  // 1. On accepte uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // 2. On récupère le nom du script à exécuter
    const { scriptName } = req.body;

    // 3. Liste de sécurité : seuls ces scripts sont autorisés
    const allowedScripts = [
      'validate_bao_hz.py',
      'SNIa.py',
      'CMB.py',
      'galaxy_2pcf_check.py',
      'cluster_deficit_calc.py'
    ];

    if (!scriptName || !allowedScripts.includes(scriptName)) {
      return res.status(400).json({ success: false, error: 'Invalid or unauthorized script name.' });
    }

    // 4. On lit le contenu du fichier Python demandé
    const scriptPath = path.join(process.cwd(), 'scripts', scriptName);
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    console.log(`[execute-script] Fichier lu : ${scriptName}. Envoi à Gemini...`);

    // 5. On demande à Gemini d'exécuter le script
    // C'est la seule partie qui diffère du chatbot : la question posée à Gemini.
    const prompt = `Exécute ce script Python et retourne uniquement la sortie texte brute (stdout), sans aucun commentaire additionnel de ta part:\n\n\`\`\`python\n${scriptContent}\n\`\`\``;
    
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response.text();
    
    console.log(`[execute-script] Réponse reçue de Gemini.`);

    // 6. On renvoie le résultat au site web
    return res.status(200).json({ success: true, output: geminiResponse });

  } catch (error) {
    console.error('[execute-script] ERREUR:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An internal server error occurred. ' + error.message 
    });
  }
}
