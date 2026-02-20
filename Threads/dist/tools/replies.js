/**
 * Threads Reply Management Tools
 * - threads_get_replies: Get replies to a thread
 * - threads_get_conversation: Get full conversation thread
 * - threads_hide_reply: Hide or unhide a reply
 */
import { GetRepliesSchema, HideReplySchema } from "../schemas/index.js";
import { CHARACTER_LIMIT } from "../constants.js";
function formatReply(r) {
    const lines = [];
    const hidden = r.hide_status === "HIDDEN" || r.hide_status === "COVERED" ? " 🙈" : "";
    lines.push(`**[${r.id}]** @${r.username || "unknown"} · ${new Date(r.timestamp).toLocaleString()}${hidden}`);
    if (r.text)
        lines.push(`> ${r.text}`);
    if (r.permalink)
        lines.push(`🔗 ${r.permalink}`);
    lines.push("");
    return lines.join("\n");
}
export function registerReplyTools(server, client) {
    // ── Get Replies ────────────────────────────────────────────
    server.registerTool("threads_get_replies", {
        title: "Get Thread Replies",
        description: `Get direct replies to a specific Threads post.

Args:
  - thread_id (string, required): The ID of the thread
  - reverse (boolean, optional): Reverse chronological order (default: false)
  - response_format (string, optional): "markdown" or "json"

Returns:
  List of replies with text, username, timestamp, and hide status.`,
        inputSchema: GetRepliesSchema,
        annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    }, async (params) => {
        try {
            const result = await client.getReplies(params.thread_id, undefined, params.reverse);
            const replies = result.data || [];
            if (!replies.length) {
                return { content: [{ type: "text", text: "No replies found for this thread." }] };
            }
            let text;
            if (params.response_format === "json") {
                text = JSON.stringify({ thread_id: params.thread_id, count: replies.length, replies }, null, 2);
            }
            else {
                text = `# Replies to ${params.thread_id} (${replies.length})\n\n${replies.map(formatReply).join("\n")}`;
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
    // ── Hide/Unhide Reply ──────────────────────────────────────
    server.registerTool("threads_hide_reply", {
        title: "Hide/Unhide Reply",
        description: `Hide or unhide a reply on your Threads post.

Args:
  - reply_id (string, required): The ID of the reply
  - hide (boolean, required): true to hide, false to unhide

Returns:
  Success or error message.`,
        inputSchema: HideReplySchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
        },
    }, async (params) => {
        try {
            await client.hideReply(params.reply_id, params.hide);
            const action = params.hide ? "hidden" : "unhidden";
            return { content: [{ type: "text", text: `✅ Reply ${params.reply_id} ${action} successfully.` }] };
        }
        catch (error) {
            return {
                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                isError: true,
            };
        }
    });
}
//# sourceMappingURL=replies.js.map