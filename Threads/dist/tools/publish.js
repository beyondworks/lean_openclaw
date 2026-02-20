/**
 * Threads Publishing Tools
 * - threads_create_post: Create and publish a new text/image/video post
 * - threads_reply: Reply to an existing thread
 */
import { CreatePostSchema, ReplyToThreadSchema } from "../schemas/index.js";
import { THREADS_POST_CHAR_LIMIT } from "../constants.js";
export function registerPublishTools(server, client) {
    // ── Create Post ────────────────────────────────────────────
    server.registerTool("threads_create_post", {
        title: "Create Threads Post",
        description: `Create and publish a new post on Threads.

Supports text-only, image, or video posts. Text is limited to ${THREADS_POST_CHAR_LIMIT} characters.
Posts go through a two-step process: container creation → publish.

Args:
  - text (string, required): Post content (max ${THREADS_POST_CHAR_LIMIT} chars)
  - image_url (string, optional): URL of image to attach (JPEG/PNG)
  - video_url (string, optional): URL of video to attach (max 5 min)
  - reply_control (string, optional): Who can reply - "everyone", "accounts_you_follow", "mentioned_only"

Returns:
  Published post ID and permalink.

Examples:
  - Post text: threads_create_post({ text: "Hello Threads!" })
  - Post with image: threads_create_post({ text: "Check this out", image_url: "https://..." })

Rate Limit: Max 250 posts per 24 hours.`,
        inputSchema: CreatePostSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
        },
    }, async (params) => {
        try {
            const container = await client.createMediaContainer({
                text: params.text,
                imageUrl: params.image_url,
                videoUrl: params.video_url,
                replyControl: params.reply_control,
            });
            // Wait for container processing
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const published = await client.publishContainer(container.id);
            return {
                content: [{
                        type: "text",
                        text: `✅ Post published successfully!\n\nPost ID: ${published.id}\nText: "${params.text.substring(0, 100)}${params.text.length > 100 ? '...' : ''}"`,
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error creating post: ${error instanceof Error ? error.message : String(error)}`,
                    }],
                isError: true,
            };
        }
    });
    // ── Reply to Thread ────────────────────────────────────────
    server.registerTool("threads_reply", {
        title: "Reply to Thread",
        description: `Reply to an existing Threads post.

Args:
  - thread_id (string, required): The ID of the thread to reply to
  - text (string, required): Reply text (max ${THREADS_POST_CHAR_LIMIT} chars)

Returns:
  Published reply ID.

Rate Limit: Max 1000 replies per 24 hours.`,
        inputSchema: ReplyToThreadSchema,
        annotations: {
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
        },
    }, async (params) => {
        try {
            const result = await client.replyToThread(params.thread_id, params.text);
            return {
                content: [{
                        type: "text",
                        text: `✅ Reply posted successfully!\n\nReply ID: ${result.id}\nIn reply to: ${params.thread_id}\nText: "${params.text.substring(0, 100)}${params.text.length > 100 ? '...' : ''}"`,
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error posting reply: ${error instanceof Error ? error.message : String(error)}`,
                    }],
                isError: true,
            };
        }
    });
}
//# sourceMappingURL=publish.js.map