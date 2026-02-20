/**
 * Threads Content Retrieval Tools
 * - threads_get_my_posts: List my recent threads
 * - threads_get_post: Get a specific thread by ID
 * - threads_delete_post: Delete a thread
 * - threads_search: Search public posts by keyword
 */
import { GetMyThreadsSchema, GetThreadSchema, DeleteThreadSchema, SearchPostsSchema, } from "../schemas/index.js";
import { CHARACTER_LIMIT } from "../constants.js";
function formatThread(t) {
    const lines = [];
    lines.push(`**[${t.id}]** @${t.username || "me"} · ${new Date(t.timestamp).toLocaleString()}`);
    if (t.text)
        lines.push(t.text);
    if (t.media_type !== "TEXT_POST")
        lines.push(`📎 ${t.media_type}`);
    if (t.topic_tag)
        lines.push(`🏷️ ${t.topic_tag}`);
    if (t.permalink)
        lines.push(`🔗 ${t.permalink}`);
    lines.push("---");
    return lines.join("\n");
}
export function registerContentTools(server, client) {
    // ── Get My Threads ─────────────────────────────────────────
    server.registerTool("threads_get_my_posts", {
        title: "Get My Threads Posts",
        description: `Retrieve your recent Threads posts.

Args:
  - limit (number, optional): Number of posts to return (1-100, default 25)
  - since (string, optional): ISO 8601 date filter
  - until (string, optional): ISO 8601 date filter
  - response_format (string, optional): "markdown" or "json"

Returns:
  List of your recent posts with text, media type, timestamp, and permalink.`,
        inputSchema: GetMyThreadsSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    }, async (params) => {
        try {
            const result = await client.getUserThreads(undefined, params.limit, params.since, params.until);
            const threads = result.data || [];
            if (!threads.length) {
                return { content: [{ type: "text", text: "No posts found." }] };
            }
            let text;
            if (params.response_format === "json") {
                text = JSON.stringify({ count: threads.length, posts: threads }, null, 2);
            }
            else {
                text = `# My Threads Posts (${threads.length})\n\n${threads.map(formatThread).join("\n")}`;
            }
            if (text.length > CHARACTER_LIMIT) {
                text = text.substring(0, CHARACTER_LIMIT) + "\n\n⚠️ Response truncated. Use 'limit' or date filters.";
            }
            return { content: [{ type: "text", text }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                isError: true,
            };
        }
    });
    // ── Get Single Thread ──────────────────────────────────────
    server.registerTool("threads_get_post", {
        title: "Get Thread Post",
        description: `Get details of a specific Threads post by ID.

Args:
  - thread_id (string, required): The post ID
  - response_format (string, optional): "markdown" or "json"

Returns:
  Post details including text, media type, timestamp, and permalink.`,
        inputSchema: GetThreadSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    }, async (params) => {
        try {
            const thread = await client.getThread(params.thread_id);
            const text = params.response_format === "json"
                ? JSON.stringify(thread, null, 2)
                : formatThread(thread);
            return { content: [{ type: "text", text }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                isError: true,
            };
        }
    });
    // ── Delete Thread ──────────────────────────────────────────
    server.registerTool("threads_delete_post", {
        title: "Delete Thread Post",
        description: `Delete one of your Threads posts.

Args:
  - thread_id (string, required): The ID of the post to delete

Returns:
  Success or error message. This action is irreversible.`,
        inputSchema: DeleteThreadSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: true,
            idempotentHint: true,
            openWorldHint: true,
        },
    }, async (params) => {
        try {
            await client.deleteThread(params.thread_id);
            return { content: [{ type: "text", text: `✅ Post ${params.thread_id} deleted successfully.` }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                isError: true,
            };
        }
    });
    // ── Search Public Posts ────────────────────────────────────
    server.registerTool("threads_search", {
        title: "Search Threads Posts",
        description: `Search public Threads posts by keyword.

Args:
  - query (string, required): Search keyword (max 200 chars)
  - media_type (string, optional): Filter - "TEXT_POST", "IMAGE", or "VIDEO"
  - since (string, optional): ISO 8601 date filter
  - until (string, optional): ISO 8601 date filter
  - response_format (string, optional): "markdown" or "json"

Returns:
  List of matching public posts.`,
        inputSchema: SearchPostsSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    }, async (params) => {
        try {
            const result = await client.searchPosts(params.query, params.media_type, params.since, params.until);
            const posts = result.data || [];
            if (!posts.length) {
                return { content: [{ type: "text", text: `No posts found for "${params.query}".` }] };
            }
            let text;
            if (params.response_format === "json") {
                text = JSON.stringify({ query: params.query, count: posts.length, posts }, null, 2);
            }
            else {
                text = `# Search Results: "${params.query}" (${posts.length})\n\n${posts.map(formatThread).join("\n")}`;
            }
            if (text.length > CHARACTER_LIMIT) {
                text = text.substring(0, CHARACTER_LIMIT) + "\n\n⚠️ Response truncated.";
            }
            return { content: [{ type: "text", text }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                isError: true,
            };
        }
    });
}
//# sourceMappingURL=content.js.map