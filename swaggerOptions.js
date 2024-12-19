const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "API for CAPI",
        version: "1.0.0",
        description:
          "API & Websocket for CAPI in Godot",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./crud/*.js"],
  };

module.exports = swaggerJsdoc(options);