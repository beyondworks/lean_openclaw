#!/usr/bin/env node
/**
 * Threads MCP Server
 *
 * MCP server for Meta's Threads API integration.
 * Provides tools for posting, replying, analytics, and content management.
 *
 * Required environment variable:
 *   THREADS_ACCESS_TOKEN - Long-lived OAuth access token
 *
 * Usage:
 *   THREADS_ACCESS_TOKEN=xxx node dist/index.js         # stdio mode (default)
 *   THREADS_ACCESS_TOKEN=xxx TRANSPORT=http node dist/index.js  # HTTP mode
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ThreadsApiClient } from "./services/threads-api.js";
import { registerPublishTools } from "./tools/publish.js";
import { registerContentTools } from "./tools/content.js";
import { registerReplyTools } from "./tools/replies.js";
import { registerInsightTools } from "./tools/insights.js";
// ── Initialize ───────────────────────────────────────────────
const accessToken = process.env.THREADS_ACCESS_TOKEN;
if (!accessToken) {
    console.error("ERROR: THREADS_ACCESS_TOKEN environment variable is required.");
    console.error("");
    console.error("To get an access token:");
    console.error("1. Create a Meta Developer App at https://developers.facebook.com");
    console.error("2. Add the 'Threads API' product");
    console.error("3. Request scopes: threads_basic, threads_content_publish, threads_manage_insights, threads_read_replies");
    console.error("4. Complete OAuth flow and generate a long-lived access token");
    console.error("");
    console.error("Then run: THREADS_ACCESS_TOKEN=your_token node dist/index.js");
    process.exit(1);
}
// Create API client
const client = new ThreadsApiClient(accessToken);
// Create MCP server
const server = new McpServer({
    name: "threads-mcp-server",
    version: "1.0.0",
});
// ── Register All Tools ───────────────────────────────────────
registerPublishTools(server, client);
registerContentTools(server, client);
registerReplyTools(server, client);
registerInsightTools(server, client);
// ── Start Server ─────────────────────────────────────────────
async function runStdio() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("🧵 Threads MCP Server running via stdio");
}
runStdio().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map