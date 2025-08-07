// Fichier : api/execute-script.js (Version de Test 1)

export default async function handler(request, response) {
  // Gérer la poignée de main CORS, comme dans le chatbot
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.status(204).end();
    return;
  }
  response.setHeader('Access-Control-Allow-Origin', '*');

  // On répond simplement un message de succès
  console.log("[execute-script TEST 1] Reçu un appel. Je réponds 'Bonjour'.");
  response.status(200).json({ success: true, output: "TEST 1 REUSSI : Bonjour depuis /api/execute-script !" });
}
