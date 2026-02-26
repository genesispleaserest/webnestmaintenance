import { config } from "./config";

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "WebNest API",
    version: "1.0.0"
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: config.sessionCookieName
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              details: { type: "array", items: {} }
            },
            required: ["code", "message"]
          }
        },
        required: ["error"]
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["ADMIN", "STAFF"] }
        },
        required: ["id", "name", "email", "role"]
      },
      Lead: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string" },
          phone: { type: "string", nullable: true },
          source: { type: "string" },
          status: { type: "string", enum: ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] },
          message: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      LeadNote: {
        type: "object",
        properties: {
          id: { type: "string" },
          leadId: { type: "string" },
          body: { type: "string" },
          createdByUserId: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        }
      },
      Quote: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string" },
          budgetRange: { type: "string" },
          timeline: { type: "string" },
          service: {
            type: "string",
            enum: ["DEV", "DESIGN", "SECURITY", "AUTOMATION"]
          },
          details: { type: "string" },
          status: { type: "string", enum: ["NEW", "SENT", "ACCEPTED", "DECLINED"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      PublicContactRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string" },
          phone: { type: "string" },
          message: { type: "string" }
        },
        required: ["name", "email", "company", "message"]
      },
      PublicQuoteRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string" },
          budgetRange: { type: "string" },
          timeline: { type: "string" },
          service: { type: "string", enum: ["DEV", "DESIGN", "SECURITY", "AUTOMATION"] },
          details: { type: "string" }
        },
        required: ["name", "email", "company", "budgetRange", "timeline", "service", "details"]
      },
      LeadCreateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string" },
          phone: { type: "string" },
          source: { type: "string" },
          message: { type: "string" },
          status: { type: "string", enum: ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] }
        },
        required: ["name", "email", "company", "source", "message"]
      },
      LeadUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string" },
          phone: { type: "string", nullable: true },
          source: { type: "string" },
          message: { type: "string" },
          status: { type: "string", enum: ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] }
        }
      },
      LeadNoteRequest: {
        type: "object",
        properties: {
          body: { type: "string" }
        },
        required: ["body"]
      },
      QuoteCreateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string" },
          budgetRange: { type: "string" },
          timeline: { type: "string" },
          service: {
            type: "string",
            enum: ["DEV", "DESIGN", "SECURITY", "AUTOMATION"]
          },
          details: { type: "string" },
          status: { type: "string", enum: ["NEW", "SENT", "ACCEPTED", "DECLINED"] }
        },
        required: ["name", "email", "company", "budgetRange", "timeline", "service", "details"]
      },
      QuoteUpdateRequest: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          company: { type: "string" },
          budgetRange: { type: "string" },
          timeline: { type: "string" },
          service: {
            type: "string",
            enum: ["DEV", "DESIGN", "SECURITY", "AUTOMATION"]
          },
          details: { type: "string" },
          status: { type: "string", enum: ["NEW", "SENT", "ACCEPTED", "DECLINED"] }
        }
      },
      LoginRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" }
        },
        required: ["email", "password"]
      }
    }
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": { description: "OK" }
        }
      }
    },
    "/api/public/contact": {
      post: {
        summary: "Submit a contact lead",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PublicContactRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { leadId: { type: "string" } }
                }
              }
            }
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/public/quote": {
      post: {
        summary: "Submit a quote request",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PublicQuoteRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { quoteId: { type: "string" } }
                }
              }
            }
          },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } }
          }
        },
        responses: {
          "200": {
            description: "Authenticated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } }
                }
              }
            }
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/auth/logout": {
      post: {
        summary: "Logout",
        security: [{ cookieAuth: [] }],
        responses: {
          "204": { description: "Logged out" }
        }
      }
    },
    "/api/auth/me": {
      get: {
        summary: "Get current user",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Current user",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { user: { $ref: "#/components/schemas/User" } }
                }
              }
            }
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/leads": {
      get: {
        summary: "List leads",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] } }
        ],
        responses: {
          "200": { description: "List of leads" },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      },
      post: {
        summary: "Create lead",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LeadCreateRequest" }
            }
          }
        },
        responses: {
          "201": { description: "Created" },
          "400": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/leads/{id}": {
      get: {
        summary: "Get lead by id",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Lead" },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      },
      patch: {
        summary: "Update lead",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LeadUpdateRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Updated" },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/leads/{id}/notes": {
      post: {
        summary: "Add lead note",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LeadNoteRequest" }
            }
          }
        },
        responses: {
          "201": { description: "Created" },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/quotes": {
      get: {
        summary: "List quotes",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "q", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["NEW", "SENT", "ACCEPTED", "DECLINED"] } }
        ],
        responses: {
          "200": { description: "List of quotes" },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      },
      post: {
        summary: "Create quote",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuoteCreateRequest" }
            }
          }
        },
        responses: {
          "201": { description: "Created" }
        }
      }
    },
    "/api/quotes/{id}": {
      get: {
        summary: "Get quote by id",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Quote" },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      },
      patch: {
        summary: "Update quote",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/QuoteUpdateRequest" }
            }
          }
        },
        responses: {
          "200": { description: "Updated" },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    }
  }
};
