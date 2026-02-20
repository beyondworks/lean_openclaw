/**
 * Threads Content Retrieval Tools
 * - threads_get_my_posts: List my recent threads
 * - threads_get_post: Get a specific thread by ID
 * - threads_delete_post: Delete a thread
 * - threads_search: Search public posts by keyword
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ThreadsApiClient } from "../services/threads-api.js";
export declare function registerContentTools(server: McpServer, client: ThreadsApiClient): void;
//# sourceMappingURL=content.d.ts.map