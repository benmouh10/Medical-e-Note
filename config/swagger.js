const { refreshToken } = require('firebase-admin/app');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Medical e-Note API',
      version: '1.0.0',
      description: 'Documentation de l\'API Medical e-Note'
    },
    servers: [{ url: 'http://localhost:8000/api' }],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'medecin'] },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'medecin'] }
          }
        },
        Patient: {
          type: 'object',
          properties: {
            patient_id: { type: 'integer' },
            name: { type: 'string' },
            date_of_birth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female'] },
            phone: { type: 'string' },
            created_by: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        PatientInput: {
          type: 'object',
          required: ['name', 'date_of_birth', 'gender', 'phone'],
          properties: {
            name: { type: 'string' },
            date_of_birth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female'] },
            phone: { type: 'string' }
          }
        },
        Note: {
          type: 'object',
          properties: {
            note_id: { type: 'integer' },
            created_for: { type: 'integer' },
            created_by: { type: 'integer' },
            diagnosis: { type: 'string' },
            prescription: { type: 'string' },
            attachments: {
              type: 'array',
              items: { type: 'string' }
            },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        NoteInput: {
          type: 'object',
          required: ['created_for', 'diagnosis', 'prescription'],
          properties: {
            created_for: { type: 'integer' },
            diagnosis: { type: 'string' },
            prescription: { type: 'string' },
            attachments: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        Stats: {
          type: 'object',
          properties: {
            total_patients: { type: 'integer' },
            total_notes: { type: 'integer' },
            total_users: { type: 'integer' }
          }
       },
        UploadResponse: {
          type: 'object',
          properties: {
            fileUrl: { type: 'string' }
          }
        },
        UpdateAccessInput: {
          type: 'object',
          properties: {
            role: {
              type: 'string',
              enum: ['admin', 'medecin'],
              description: "Nouveau rôle de l'utilisateur"
           },
            is_active: {
              type: 'boolean',
              description: 'Activer ou désactiver le compte'
            }
          },
          required: ['role', 'is_active']
        },

        ForgotPasswordInput: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: "Email de l'utilisateur"
            }
          },
          required: ['email']
        },
        ResetPasswordInput: {
          type: 'object',
          properties: {
            resetCode: {
              type: 'string',
              description: 'Code de réinitialisation envoyé par email'
            },
            newPassword: {
              type: 'string',
              description: 'Nouveau mot de passe'
            }
          },
          required: ['resetCode', 'newPassword']
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
},
  apis: ['./routes/*.js'], // commentaires JSDoc dans les fichiers route
};

const specs = swaggerJsdoc(options);


/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentification et gestion du compte
 *   - name: Users
 *     description: Gestion des utilisateurs (Admin only)
 *   - name: Patients
 *     description: Gestion des patients
 *   - name: Notes
 *     description: Gestion des notes médicales
 *   - name: Stats
 *     description: Statistiques
 *   - name: Upload
 *     description: Upload de fichiers
 */




















module.exports = {
  swaggerUi,
  specs,
};


