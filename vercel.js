{
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs20.x"
    }
  },
  "installCommand": "npm install",
  "buildCommand": "echo 'No build step required for API functions'",
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "POST, GET, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type" },
        { "key": "Vary", "value": "Origin" }
      ]
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}

