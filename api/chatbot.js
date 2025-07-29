import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function (request, response) {
  // Gérer la requête OPTIONS (pré-vol CORS)
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Autorise les méthodes POST, GET, OPTIONS
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Autorise l'en-tête Content-Type, nécessaire pour JSON
    response.status(204).end(); // Réponse 204 No Content pour un pré-vol OPTIONS réussi
    return;
  }

  // Configurer les en-têtes CORS pour les requêtes réelles (POST, GET)
  response.setHeader('Access-Control-Allow-Origin', '*'); // Autorise toutes les origines pour les requêtes suivantes
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Double vérification des méthodes autorisées
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Double vérification des en-têtes autorisés
  response.setHeader('Vary', 'Origin'); // Indique au navigateur que la réponse peut varier selon l'origine

  const message = request.body.message;

  // Vérifier si le message est présent
  if (!message) {
    response.status(400).json({ error: 'Message is required' });
    return;
  }

  // Initialiser l'API Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    // Générer le contenu avec Gemini
    const result = await model.generateContent(message);
    const geminiResponse = await result.response;
    const text = geminiResponse.text();

    // Renvoyer la réponse de l'IA
    response.status(200).json({ reply: text });
  } catch (error) {
    // Gérer les erreurs de l'API Gemini
    console.error("Gemini API error:", error);
    response.status(500).json({ error: 'Failed to get response from Gemini API', details: error.message });
  }
}
