// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load custom schemas
const userSchema = require('./swagger/schemas/userSchema');
const classSchema = require('./swagger/schemas/classSchema');
const departmentSchema = require('./swagger/schemas/departmentSchema');
const enrollmentSchema = require('./swagger/schemas/enrollmentSchema');
const courseSchema = require('./swagger/schemas/courseSchema');

// Swagger definition setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management API',
      version: '1.0.0',
      description: 'API for school admin storage and management',
    },
    servers: [
      {
        url: 'https://cse-341-project-m8mw.onrender.com/api',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5500/api',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        googleOAuth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl:
                'https://cse-341-project-m8mw.onrender.com/api/auth/google',
              tokenUrl:
                'https://cse-341-project-m8mw.onrender.com/api/auth/google/callback',
              scopes: {
                openid: 'OpenID access',
                profile: 'View your profile info',
                email: 'View your email address',
              },
            },
          },
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        user: userSchema,
        class: classSchema,
        department: departmentSchema,
        course: courseSchema,
        enrollment: enrollmentSchema,
      },
    },
    security: [{ bearerAuth: [] }, { googleOAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

// Generate the OpenAPI spec
const specs = swaggerJsdoc(options);

// Create swagger directory if it doesn't exist
const swaggerDir = path.join(__dirname, 'swagger');
if (!fs.existsSync(swaggerDir)) {
  fs.mkdirSync(swaggerDir, { recursive: true });
}

// Save as YAML
const yamlOutputPath = path.join(swaggerDir, 'swagger-output.yaml');
try {
  fs.writeFileSync(yamlOutputPath, yaml.dump(specs));
} catch (err) {
  console.error('Error writing Swagger YAML file:', err);
}

// Export for use in Express
module.exports = app => {
  // Serve Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      swaggerOptions: {
        oauth: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          scopes: ['openid', 'profile', 'email'],
          usePkceWithAuthorizationCodeGrant: true,
          redirectUri:
            'https://cse-341-project-m8mw.onrender.com/api/auth/google/callback',
        },
        persistAuthorization: true,
      },
    }),
  );

  // Serve raw JSON and YAML
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(specs);
  });

  app.get('/api-docs.yaml', (req, res) => {
    res.setHeader('Content-Type', 'application/x-yaml');
    res.sendFile(yamlOutputPath);
  });
};
