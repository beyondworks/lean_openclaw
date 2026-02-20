/**
 * Threads Insights & Analytics Tools
 * - threads_get_post_insights: Get metrics for a specific post
 * - threads_get_account_insights: Get account-level analytics
 * - threads_get_publishing_limit: Check current publishing quota
 * - threads_get_profile: Get authenticated user profile
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ThreadsApiClient } from "../services/threads-api.js";
import {
  GetPostInsightsSchema,
  GetAccountInsightsSchema,
  GetPublishingLimitSchema,
  GetProfileSchema,
} from "../schemas/index.js";
import type { z } from "zod";

export function registerInsightTools(server: McpServer, client: ThreadsApiClient): void {

  // ── Post Insights ──────────────────────────────────────────
  server.registerTool(
    "threads_get_post_insights",
    {
      title: "Get Post Insights",
      description: `Get engagement metrics for a specific Threads post.

Args:
  - thread_id (string, required): The ID of the thread
  - response_format (string, optional): "markdown" or "json"

Returns:
  Metrics including views, likes, replies, reposts, and quotes.`,
      inputSchema: GetPostInsightsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params: z.infer<typeof GetPostInsightsSchema>) => {
      try {
        const result = await client.getMediaInsights(params.thread_id);
        const insights = result.data || [];

        if (params.response_format === "json") {
          return { content: [{ type: "text" as const, text: JSON.stringify({ thread_id: params.thread_id, insights }, null, 2) }] };
        }

        const lines = [`# Post Insights: ${params.thread_id}\n`];
        for (const metric of insights) {
          const value = metric.values[0]?.value ?? "N/A";
          lines.push(`- **${metric.title || metric.name}**: ${value}`);
        }
        return { content: [{ type: "text" as const, text: lines.join("\n") }] };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        };
      }
    }
  );

  // ── Account Insights ───────────────────────────────────────
  server.registerTool(
    "threads_get_account_insights",
    {
      title: "Get Account Insights",
      description: `Get account-level analytics for your Threads profile.

Args:
  - since (number, optional): Unix timestamp - start of range
  - until (number, optional): Unix timestamp - end of range
  - response_format (string, optional): "markdown" or "json"

Returns:
  Account metrics including total views, likes, followers, etc.`,
      inputSchema: GetAccountInsightsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params: z.infer<typeof GetAccountInsightsSchema>) => {
      try {
        const result = await client.getUserInsights(undefined, params.since, params.until);
        const insights = result.data || [];

        if (params.response_format === "json") {
          return { content: [{ type: "text" as const, text: JSON.stringify({ insights }, null, 2) }] };
        }

        const lines = ["# Account Insights\n"];
        for (const metric of insights) {
          const value = metric.values[0]?.value ?? "N/A";
          lines.push(`- **${metric.title || metric.name}**: ${value}`);
        }
        return { content: [{ type: "text" as const, text: lines.join("\n") }] };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        };
      }
    }
  );

  // ── Publishing Limit ───────────────────────────────────────
  server.registerTool(
    "threads_get_publishing_limit",
    {
      title: "Get Publishing Limit",
      description: `Check your current Threads publishing quota usage.

Returns:
  Current post/reply usage vs. limits (250 posts, 1000 replies per 24h).`,
      inputSchema: GetPublishingLimitSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params: z.infer<typeof GetPublishingLimitSchema>) => {
      try {
        const limit = await client.getPublishingLimit();

        if (params.response_format === "json") {
          return { content: [{ type: "text" as const, text: JSON.stringify(limit, null, 2) }] };
        }

        const postUsage = limit.quota_usage || 0;
        const postTotal = limit.config?.quota_total || 250;
        const replyUsage = limit.reply_quota_usage || 0;
        const replyTotal = limit.reply_config?.quota_total || 1000;

        const text = [
          "# Publishing Limit Status\n",
          `📝 **Posts**: ${postUsage} / ${postTotal} (${Math.round((postUsage / postTotal) * 100)}% used)`,
          `💬 **Replies**: ${replyUsage} / ${replyTotal} (${Math.round((replyUsage / replyTotal) * 100)}% used)`,
          "",
          `Posts remaining: ${postTotal - postUsage}`,
          `Replies remaining: ${replyTotal - replyUsage}`,
        ].join("\n");

        return { content: [{ type: "text" as const, text }] };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        };
      }
    }
  );

  // ── User Profile ───────────────────────────────────────────
  server.registerTool(
    "threads_get_profile",
    {
      title: "Get My Threads Profile",
      description: `Get your Threads profile information.

Returns:
  Username, name, bio, profile picture, verification status.`,
      inputSchema: GetProfileSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params: z.infer<typeof GetProfileSchema>) => {
      try {
        const profile = await client.getMe();

        if (params.response_format === "json") {
          return { content: [{ type: "text" as const, text: JSON.stringify(profile, null, 2) }] };
        }

        const verified = profile.is_verified ? " ✅" : "";
        const text = [
          `# @${profile.username}${verified}\n`,
          profile.name ? `**Name**: ${profile.name}` : null,
          profile.threads_biography ? `**Bio**: ${profile.threads_biography}` : null,
          `**ID**: ${profile.id}`,
        ].filter(Boolean).join("\n");

        return { content: [{ type: "text" as const, text }] };
      } catch (error) {
        return {
          content: [{ type: "text" as const, text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
          isError: true,
        };
      }
    }
  );
}
