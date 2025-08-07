/// <reference path="../types.d.ts" />
migrate((db) => {
  // Create companies/tenants collection
  const companies = new Collection({
    id: "companies",
    name: "companies",
    type: "base",
    system: false,
    schema: [
      {
        id: "name",
        name: "name",
        type: "text",
        system: false,
        required: true,
        unique: false,
        options: {
          min: 2,
          max: 100,
          pattern: ""
        }
      },
      {
        id: "domain",
        name: "domain",
        type: "text",
        system: false,
        required: false,
        unique: true,
        options: {
          min: 0,
          max: 100,
          pattern: ""
        }
      },
      {
        id: "logo",
        name: "logo",
        type: "file",
        system: false,
        required: false,
        unique: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/webp"],
          thumbs: ["100x100"],
          protected: false
        }
      },
      {
        id: "settings",
        name: "settings",
        type: "json",
        system: false,
        required: false,
        unique: false,
        options: {}
      },
      {
        id: "status",
        name: "status",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["active", "suspended", "pending"]
        }
      }
    ],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''"
  });

  // Create users collection with company relationship
  const users = new Collection({
    id: "users",
    name: "users",
    type: "auth",
    system: false,
    schema: [
      {
        id: "company",
        name: "company",
        type: "relation",
        system: false,
        required: true,
        unique: false,
        options: {
          collectionId: "companies",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["name"]
        }
      },
      {
        id: "role",
        name: "role",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["admin", "manager", "analyst", "viewer"]
        }
      },
      {
        id: "avatar",
        name: "avatar",
        type: "file",
        system: false,
        required: false,
        unique: false,
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/webp"],
          thumbs: ["100x100"],
          protected: false
        }
      }
    ],
    listRule: "@request.auth.id != ''",
    viewRule: "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''"
  });

  // Create API documents collection
  const apiDocuments = new Collection({
    id: "api_documents",
    name: "api_documents",
    type: "base",
    system: false,
    schema: [
      {
        id: "company",
        name: "company",
        type: "relation",
        system: false,
        required: true,
        unique: false,
        options: {
          collectionId: "companies",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["name"]
        }
      },
      {
        id: "fileName",
        name: "fileName",
        type: "text",
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 255,
          pattern: ""
        }
      },
      {
        id: "title",
        name: "title",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 255,
          pattern: ""
        }
      },
      {
        id: "version",
        name: "version",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 50,
          pattern: ""
        }
      },
      {
        id: "format",
        name: "format",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["openapi", "swagger", "raml", "graphql", "other"]
        }
      },
      {
        id: "file",
        name: "file",
        type: "file",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          maxSize: 52428800,
          mimeTypes: ["application/json", "application/yaml", "text/yaml", "application/xml"],
          thumbs: [],
          protected: false
        }
      },
      {
        id: "description",
        name: "description",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 1000,
          pattern: ""
        }
      },
      {
        id: "tags",
        name: "tags",
        type: "json",
        system: false,
        required: false,
        unique: false,
        options: {}
      },
      {
        id: "uploadedBy",
        name: "uploadedBy",
        type: "relation",
        system: false,
        required: true,
        unique: false,
        options: {
          collectionId: "users",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["name"]
        }
      }
    ],
    listRule: "@request.auth.id != '' && @request.auth.record.company = company",
    viewRule: "@request.auth.id != '' && @request.auth.record.company = company",
    createRule: "@request.auth.id != '' && @request.auth.record.company = company",
    updateRule: "@request.auth.id != '' && @request.auth.record.company = company",
    deleteRule: "@request.auth.id != '' && @request.auth.record.company = company"
  });

  // Create API catalog collection
  const apiCatalog = new Collection({
    id: "api_catalog",
    name: "api_catalog",
    type: "base",
    system: false,
    schema: [
      {
        id: "company",
        name: "company",
        type: "relation",
        system: false,
        required: true,
        unique: false,
        options: {
          collectionId: "companies",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["name"]
        }
      },
      {
        id: "name",
        name: "name",
        type: "text",
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 255,
          pattern: ""
        }
      },
      {
        id: "endpoint",
        name: "endpoint",
        type: "text",
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 500,
          pattern: ""
        }
      },
      {
        id: "method",
        name: "method",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]
        }
      },
      {
        id: "category",
        name: "category",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 100,
          pattern: ""
        }
      },
      {
        id: "owner",
        name: "owner",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 255,
          pattern: ""
        }
      },
      {
        id: "status",
        name: "status",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["active", "deprecated", "development"]
        }
      },
      {
        id: "documentationUrl",
        name: "documentationUrl",
        type: "url",
        system: false,
        required: false,
        unique: false,
        options: {
          exceptDomains: [],
          onlyDomains: []
        }
      }
    ],
    listRule: "@request.auth.id != '' && @request.auth.record.company = company",
    viewRule: "@request.auth.id != '' && @request.auth.record.company = company",
    createRule: "@request.auth.id != '' && @request.auth.record.company = company",
    updateRule: "@request.auth.id != '' && @request.auth.record.company = company",
    deleteRule: "@request.auth.id != '' && @request.auth.record.company = company"
  });

  // Create MCP implementations collection
  const mcpImplementations = new Collection({
    id: "mcp_implementations",
    name: "mcp_implementations",
    type: "base",
    system: false,
    schema: [
      {
        id: "company",
        name: "company",
        type: "relation",
        system: false,
        required: true,
        unique: false,
        options: {
          collectionId: "companies",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["name"]
        }
      },
      {
        id: "name",
        name: "name",
        type: "text",
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 255,
          pattern: ""
        }
      },
      {
        id: "description",
        name: "description",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 1000,
          pattern: ""
        }
      },
      {
        id: "endpoints",
        name: "endpoints",
        type: "json",
        system: false,
        required: false,
        unique: false,
        options: {}
      },
      {
        id: "dataSources",
        name: "dataSources",
        type: "json",
        system: false,
        required: false,
        unique: false,
        options: {}
      },
      {
        id: "actions",
        name: "actions",
        type: "json",
        system: false,
        required: false,
        unique: false,
        options: {}
      },
      {
        id: "securityLevel",
        name: "securityLevel",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["low", "medium", "high", "critical"]
        }
      },
      {
        id: "status",
        name: "status",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["active", "monitoring", "inactive"]
        }
      }
    ],
    listRule: "@request.auth.id != '' && @request.auth.record.company = company",
    viewRule: "@request.auth.id != '' && @request.auth.record.company = company",
    createRule: "@request.auth.id != '' && @request.auth.record.company = company",
    updateRule: "@request.auth.id != '' && @request.auth.record.company = company",
    deleteRule: "@request.auth.id != '' && @request.auth.record.company = company"
  });

  // Create security policies collection
  const securityPolicies = new Collection({
    id: "security_policies",
    name: "security_policies",
    type: "base",
    system: false,
    schema: [
      {
        id: "company",
        name: "company",
        type: "relation",
        system: false,
        required: true,
        unique: false,
        options: {
          collectionId: "companies",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["name"]
        }
      },
      {
        id: "name",
        name: "name",
        type: "text",
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 255,
          pattern: ""
        }
      },
      {
        id: "description",
        name: "description",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 1000,
          pattern: ""
        }
      },
      {
        id: "type",
        name: "type",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["authentication", "authorization", "rate_limiting", "encryption", "validation"]
        }
      },
      {
        id: "rules",
        name: "rules",
        type: "json",
        system: false,
        required: true,
        unique: false,
        options: {}
      },
      {
        id: "status",
        name: "status",
        type: "select",
        system: false,
        required: true,
        unique: false,
        options: {
          maxSelect: 1,
          values: ["active", "inactive", "draft"]
        }
      }
    ],
    listRule: "@request.auth.id != '' && @request.auth.record.company = company",
    viewRule: "@request.auth.id != '' && @request.auth.record.company = company",
    createRule: "@request.auth.id != '' && @request.auth.record.company = company",
    updateRule: "@request.auth.id != '' && @request.auth.record.company = company",
    deleteRule: "@request.auth.id != '' && @request.auth.record.company = company"
  });

  // Create audit logs collection
  const auditLogs = new Collection({
    id: "audit_logs",
    name: "audit_logs",
    type: "base",
    system: false,
    schema: [
      {
        id: "company",
        name: "company",
        type: "relation",
        system: false,
        required: true,
        unique: false,
        options: {
          collectionId: "companies",
          cascadeDelete: true,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["name"]
        }
      },
      {
        id: "user",
        name: "user",
        type: "relation",
        system: false,
        required: true,
        unique: false,
        options: {
          collectionId: "users",
          cascadeDelete: false,
          minSelect: null,
          maxSelect: 1,
          displayFields: ["name"]
        }
      },
      {
        id: "action",
        name: "action",
        type: "text",
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 100,
          pattern: ""
        }
      },
      {
        id: "resource",
        name: "resource",
        type: "text",
        system: false,
        required: true,
        unique: false,
        options: {
          min: 1,
          max: 100,
          pattern: ""
        }
      },
      {
        id: "details",
        name: "details",
        type: "json",
        system: false,
        required: false,
        unique: false,
        options: {}
      },
      {
        id: "ipAddress",
        name: "ipAddress",
        type: "text",
        system: false,
        required: false,
        unique: false,
        options: {
          min: 0,
          max: 45,
          pattern: ""
        }
      }
    ],
    listRule: "@request.auth.id != '' && @request.auth.record.company = company",
    viewRule: "@request.auth.id != '' && @request.auth.record.company = company",
    createRule: "@request.auth.id != '' && @request.auth.record.company = company",
    updateRule: "@request.auth.id != '' && @request.auth.record.company = company",
    deleteRule: "@request.auth.id != '' && @request.auth.record.company = company"
  });

  return db.createCollection(companies)
    .then(() => db.createCollection(users))
    .then(() => db.createCollection(apiDocuments))
    .then(() => db.createCollection(apiCatalog))
    .then(() => db.createCollection(mcpImplementations))
    .then(() => db.createCollection(securityPolicies))
    .then(() => db.createCollection(auditLogs));
}, (db) => {
  // Revert the changes
  return db.collection("audit_logs").delete()
    .then(() => db.collection("security_policies").delete())
    .then(() => db.collection("mcp_implementations").delete())
    .then(() => db.collection("api_catalog").delete())
    .then(() => db.collection("api_documents").delete())
    .then(() => db.collection("users").delete())
    .then(() => db.collection("companies").delete());
}); 