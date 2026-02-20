/**
 * Zod Schemas for Threads MCP Server Tools
 */

import { z } from "zod";

// ── Common ───────────────────────────────────────────────────

export const ResponseFormatSchema = z
  .enum(["markdown", "json"])
  .default("markdown")
  .describe("Output format: 'markdown' for human-readable or 'json' for structured data");

// ── Post / Publish ───────────────────────────────────────────

export const CreatePostSchema = z.object({
  text: z.string()
    .min(1, "Post text cannot be empty")
    .max(500, "Post text cannot exceed 500 characters")
    .describe("The text content of the post (max 500 chars)"),
  image_url: z.string().url().optional()
    .describe("URL of an image to attach (JPEG or PNG)"),
  video_url: z.string().url().optional()
    .describe("URL of a video to attach (max 5 min)"),
  reply_control: z.enum(["everyone", "accounts_you_follow", "mentioned_only"]).optional()
    .describe("Who can reply to this post"),
}).strict();

export const ReplyToThreadSchema = z.object({
  thread_id: z.string()
    .min(1, "Thread ID is required")
    .describe("The ID of the thread to reply to"),
  text: z.string()
    .min(1, "Reply text cannot be empty")
    .max(500, "Reply text cannot exceed 500 characters")
    .describe("The reply text (max 500 chars)"),
}).strict();

// ── Content Retrieval ────────────────────────────────────────

export const GetMyThreadsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25)
    .describe("Number of threads to return (1-100, default 25)"),
  since: z.string().optional()
    .describe("ISO 8601 date - only return threads after this date"),
  until: z.string().optional()
    .describe("ISO 8601 date - only return threads before this date"),
  response_format: ResponseFormatSchema,
}).strict();

export const GetThreadSchema = z.object({
  thread_id: z.string()
    .min(1, "Thread ID is required")
    .describe("The ID of the thread to retrieve"),
  response_format: ResponseFormatSchema,
}).strict();

// ── Replies ──────────────────────────────────────────────────

export const GetRepliesSchema = z.object({
  thread_id: z.string()
    .min(1, "Thread ID is required")
    .describe("The ID of the thread to get replies for"),
  reverse: z.boolean().default(false).optional()
    .describe("Return replies in reverse chronological order"),
  response_format: ResponseFormatSchema,
}).strict();

export const HideReplySchema = z.object({
  reply_id: z.string()
    .min(1, "Reply ID is required")
    .describe("The ID of the reply to hide/unhide"),
  hide: z.boolean()
    .describe("true to hide, false to unhide"),
}).strict();

// ── Insights ─────────────────────────────────────────────────

export const GetPostInsightsSchema = z.object({
  thread_id: z.string()
    .min(1, "Thread ID is required")
    .describe("The ID of the thread to get insights for"),
  response_format: ResponseFormatSchema,
}).strict();

export const GetAccountInsightsSchema = z.object({
  since: z.number().optional()
    .describe("Unix timestamp - start of the time range"),
  until: z.number().optional()
    .describe("Unix timestamp - end of the time range"),
  response_format: ResponseFormatSchema,
}).strict();

// ── Publishing Limits ────────────────────────────────────────

export const GetPublishingLimitSchema = z.object({
  response_format: ResponseFormatSchema,
}).strict();

// ── Delete ───────────────────────────────────────────────────

export const DeleteThreadSchema = z.object({
  thread_id: z.string()
    .min(1, "Thread ID is required")
    .describe("The ID of the thread to delete"),
}).strict();

// ── Search ───────────────────────────────────────────────────

export const SearchPostsSchema = z.object({
  query: z.string()
    .min(1, "Search query is required")
    .max(200, "Query must not exceed 200 characters")
    .describe("Keyword to search for in public Threads posts"),
  media_type: z.enum(["TEXT_POST", "IMAGE", "VIDEO"]).optional()
    .describe("Filter by media type"),
  since: z.string().optional()
    .describe("ISO 8601 date - only return posts after this date"),
  until: z.string().optional()
    .describe("ISO 8601 date - only return posts before this date"),
  response_format: ResponseFormatSchema,
}).strict();

// ── User Profile ─────────────────────────────────────────────

export const GetProfileSchema = z.object({
  response_format: ResponseFormatSchema,
}).strict();
