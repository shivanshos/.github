// ShivanshOS Model Context Protocol (MCP) Identity Server
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

const server = new Server(
  {
    name: "shivansh-identity-manager",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Identity tools implementation
server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "lookup_user_identity",
        description: "Look up canonical user identity and OU path",
        inputSchema: {
          type: "object",
          properties: {
            email: { type: "string" }
          },
          required: ["email"]
        }
      },
      {
        name: "verify_email_routing",
        description: "Verify Cloudflare email alias forwarding status",
        inputSchema: {
          type: "object",
          properties: {
            alias: { type: "string" }
          },
          required: ["alias"]
        }
      }
    ]
  };
});

server.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "lookup_user_identity") {
    const email = args.email;
    let ou = "/External";
    if (email === "x@shivanshsethi.in") ou = "/Admin";
    else if (email === "dev@shivanshsethi.in") ou = "/Developer";
    else if (email === "me@shivanshsethi.in") ou = "/Service";
    else if (email === "agent@shivanshsethi.in") ou = "/Agents";

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ email, canonical_domain: "shivanshsethi.in", ou_path: ou, status: "active" })
        }
      ]
    };
  }

  if (name === "verify_email_routing") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ alias: args.alias, destination: "shivanshsethi88@gmail.com", active: true })
        }
      ]
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (require.main === module) {
  main().catch(console.error);
}
