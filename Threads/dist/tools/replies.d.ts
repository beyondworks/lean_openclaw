/**
 * Threads Reply Management Tools
 * - threads_get_replies: Get replies to a thread
 * - threads_get_conversation: Get full conversation thread
 * - threads_hide_reply: Hide or unhide a reply
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ThreadsApiClient } from "../services/threads-api.js";
export declare function registerReplyTools(server: McpServer, client: ThreadsApiClient): void;
//# sourceMappingURL=replies.d.ts.map