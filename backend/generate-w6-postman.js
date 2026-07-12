import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collection = {
  info: {
    _postman_id: "bf78ae8e-2d8f-4671-b0f8-16c359545df9",
    name: "AgriSarthi Authentication & Security REST API Collection (Week 6)",
    description: "Postman collection demonstrating authentication flows, JWT persistence, protected routes, and security rate limits in AgriSarthi.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    {
      key: "jwt_token",
      value: "",
      type: "string"
    }
  ],
  item: [
    {
      name: "Register Farmer (Zod Validation)",
      request: {
        method: "POST",
        header: [
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            name: "Bhumika Bahuguna",
            email: "bhumika.farmer@example.com",
            password: "password123"
          }, null, 2)
        },
        url: {
          raw: "http://localhost:5000/api/auth/register",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "auth", "register"]
        },
        description: "Registers a new user. The email must be unique and the payload must satisfy Zod validations (minimum 6-character password)."
      },
      response: []
    },
    {
      name: "Login Farmer (JWT Generation)",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "const responseJson = pm.response.json();",
              "if (responseJson && responseJson.token) {",
              "    pm.collectionVariables.set(\"jwt_token\", responseJson.token);",
              "    console.log(\"Saved JWT to collection variable jwt_token\");",
              "}"
            ],
            type: "text/javascript"
          }
        }
      ],
      request: {
        method: "POST",
        header: [
          { key: "Content-Type", value: "application/json" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            email: "bhumika.farmer@example.com",
            password: "password123"
          }, null, 2)
        },
        url: {
          raw: "http://localhost:5000/api/auth/login",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "auth", "login"]
        },
        description: "Validates credentials, returning a JWT token which is automatically parsed and saved as a collection variable."
      },
      response: []
    },
    {
      name: "Get Authenticated User Profile (Protected)",
      request: {
        method: "GET",
        header: [
          { key: "Authorization", value: "Bearer {{jwt_token}}" }
        ],
        url: {
          raw: "http://localhost:5000/api/auth/me",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "auth", "me"]
        },
        description: "Retrieves user account credentials. Only accessible with a valid JWT Authorization Bearer header."
      },
      response: []
    },
    {
      name: "List Crops (Protected & User-Scoped)",
      request: {
        method: "GET",
        header: [
          { key: "Authorization", value: "Bearer {{jwt_token}}" }
        ],
        url: {
          raw: "http://localhost:5000/api/crops",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops"]
        },
        description: "Fetch list of crops scoped to the logged-in user. Legacy crops without a user also return as shared. Requires JWT."
      },
      response: []
    },
    {
      name: "Get Crops Stats (Protected & User-Scoped)",
      request: {
        method: "GET",
        header: [
          { key: "Authorization", value: "Bearer {{jwt_token}}" }
        ],
        url: {
          raw: "http://localhost:5000/api/crops/stats",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops", "stats"]
        },
        description: "Fetch statistical summaries calculated from database entries scoped to the authenticated user."
      },
      response: []
    },
    {
      name: "Create Crop Entry (Protected)",
      request: {
        method: "POST",
        header: [
          { key: "Content-Type", value: "application/json" },
          { key: "Authorization", value: "Bearer {{jwt_token}}" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            name: "Winter Wheat",
            variety: "Sonalika",
            type: "Grain",
            status: "Planned",
            plantedDate: "",
            expectedHarvestDate: "2027-02-15",
            fieldArea: 4.8
          }, null, 2)
        },
        url: {
          raw: "http://localhost:5000/api/crops",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops"]
        },
        description: "Registers a new crop cycle associated with the current user ID."
      },
      response: []
    },
    {
      name: "Protected Route Without Token (Expects 410/401)",
      request: {
        method: "GET",
        header: [],
        url: {
          raw: "http://localhost:5000/api/crops/stats",
          protocol: "http",
          host: ["localhost"],
          port: "5000",
          path: ["api", "crops", "stats"]
        },
        description: "Attempting to access a protected API route without sending an Authorization header. Expects an HTTP 401 Unauthorized response."
      },
      response: []
    }
  ]
};

const outputPath = path.join(__dirname, '..', 'W6_AuthAPICollection_BhumikaBahuguna.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf8');
console.log(`✅ Postman Collection exported to: ${outputPath}`);
