/**
 * Threads Insights & Analytics Tools
 * - threads_get_post_insights: Get metrics for a specific post
 * - threads_get_account_insights: Get account-level analytics
 * - threads_get_publishing_limit: Check current publishing quota
 * - threads_get_profile: Get authenticated user profile
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ThreadsApiClient } from "../services/threads-api.js";
export declare function registerInsightTools(server: McpServer, client: ThreadsApiClient): void;
//# sourceMappingURL=insights.d.ts.map