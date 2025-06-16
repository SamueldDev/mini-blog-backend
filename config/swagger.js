
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express"

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const options = {

//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'MoodMate API',
//       version: '1.0.0',
//       description: 'API documentation for the MoodMate backend',
//     },
//     servers: [
//         {
//         url: "https://moodmate-production.up.railway.app",
//         description: "Production server",
//       },
//         {
//           url: "http://localhost:3000",
//           description: "Local development server",
//         },
//     ],
//     tags: [
//       {
//         name: 'Suggestions',
//         description: 'Endpoints for mood-based suggestions',
//       },
//       {
//         name: 'Moods',
//         description: 'Endpoints for submitting and retrieving moods',
//       },
//       {
//         name: 'Auth',
//         description: 'Authentication endpoints (register/login)',
//       },
//     ],
//   },

definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Blog API',
      version: '1.0.0',
      description: 'API documentation for the Mini Blog backend',
    },
    servers: [
      {
        url: 'https://mini-blog-backend-production-3fa5.up.railway.app',
        description: 'Production Server',
      },
       {
        url: 'http://localhost:7000',
        description: 'Local Server development',
      },
    ],
     components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  apis: [path.resolve(__dirname, '../routes/*.js')], // for ESM

};


const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // ✅ Serve the raw Swagger JSON here:
    app.get('/api-docs-json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
    });
}
