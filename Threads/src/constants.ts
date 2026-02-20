/**
 * Threads MCP Server Constants
 */

// Threads API Base URL (Graph API)
export const THREADS_API_BASE = "https://graph.threads.net/v1.0";

// Response size limit
export const CHARACTER_LIMIT = 25000;

// Threads platform limits
export const THREADS_POST_CHAR_LIMIT = 500;
export const THREADS_DAILY_POST_LIMIT = 250;
export const THREADS_DAILY_REPLY_LIMIT = 1000;

// Supported media types
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
export const SUPPORTED_VIDEO_MAX_DURATION = 300; // 5 minutes in seconds

// Default pagination
export const DEFAULT_LIMIT = 25;

// OAuth scopes
export const REQUIRED_SCOPES = [
  "threads_basic",
  "threads_content_publish",
  "threads_manage_insights",
  "threads_read_replies",
  "threads_manage_replies",
] as const;
