/**
 * Threads API Client
 * Handles all HTTP communication with Meta's Threads Graph API
 */

import axios, { AxiosError } from "axios";
import { THREADS_API_BASE } from "../constants.js";
import type {
  ThreadsUser,
  ThreadsMedia,
  ThreadsReply,
  ThreadsInsight,
  ThreadsPublishingLimit,
  PaginatedResponse,
  MediaContainerResponse,
  PublishResponse,
  ThreadsApiError,
} from "../types.js";

export class ThreadsApiClient {
  private accessToken: string;
  private userId: string | null = null;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  // ── Generic Request ────────────────────────────────────────

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    params?: Record<string, unknown>,
    data?: Record<string, unknown>
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${THREADS_API_BASE}/${endpoint}`,
        params: {
          access_token: this.accessToken,
          ...params,
        },
        data,
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  private parseError(error: unknown): Error {
    if (error instanceof AxiosError && error.response?.data) {
      const apiError = error.response.data as ThreadsApiError;
      if (apiError.error) {
        const { message, code, type } = apiError.error;
        switch (code) {
          case 190:
            return new Error(`Authentication error: ${message}. Your access token may have expired. Generate a new one.`);
          case 4:
            return new Error(`Rate limit exceeded: ${message}. Wait a few minutes before retrying.`);
          case 100:
            return new Error(`Invalid parameter: ${message}. Check your input values.`);
          default:
            return new Error(`Threads API error (${type}, code ${code}): ${message}`);
        }
      }
    }
    if (error instanceof AxiosError) {
      if (error.code === "ECONNABORTED") {
        return new Error("Request timed out. Please try again.");
      }
      return new Error(`Network error: ${error.message}`);
    }
    return error instanceof Error ? error : new Error(String(error));
  }

  // ── User / Profile ─────────────────────────────────────────

  async getMe(fields?: string): Promise<ThreadsUser> {
    const defaultFields = "id,username,name,threads_profile_picture_url,threads_biography,is_verified";
    const result = await this.request<ThreadsUser>("me", "GET", {
      fields: fields || defaultFields,
    });
    this.userId = result.id;
    return result;
  }

  async getUserId(): Promise<string> {
    if (this.userId) return this.userId;
    const me = await this.getMe("id");
    return me.id;
  }

  // ── Publishing ─────────────────────────────────────────────

  /**
   * Step 1: Create a media container (text, image, video, or carousel item)
   */
  async createMediaContainer(opts: {
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    mediaType?: "TEXT" | "IMAGE" | "VIDEO" | "CAROUSEL";
    isCarouselItem?: boolean;
    replyToId?: string;
    children?: string[]; // for carousel: array of container IDs
    replyControl?: "everyone" | "accounts_you_follow" | "mentioned_only";
  }): Promise<MediaContainerResponse> {
    const userId = await this.getUserId();
    const params: Record<string, unknown> = {};

    if (opts.text) params.text = opts.text;
    if (opts.imageUrl) params.image_url = opts.imageUrl;
    if (opts.videoUrl) params.video_url = opts.videoUrl;
    if (opts.replyToId) params.reply_to_id = opts.replyToId;
    if (opts.replyControl) params.reply_control = opts.replyControl;

    if (opts.mediaType === "CAROUSEL") {
      params.media_type = "CAROUSEL";
      if (opts.children) params.children = opts.children.join(",");
    } else if (opts.imageUrl) {
      params.media_type = "IMAGE";
    } else if (opts.videoUrl) {
      params.media_type = "VIDEO";
    } else {
      params.media_type = "TEXT";
    }

    if (opts.isCarouselItem) {
      params.is_carousel_item = true;
    }

    return this.request<MediaContainerResponse>(`${userId}/threads`, "POST", params);
  }

  /**
   * Step 2: Publish the container
   */
  async publishContainer(containerId: string): Promise<PublishResponse> {
    const userId = await this.getUserId();
    return this.request<PublishResponse>(`${userId}/threads_publish`, "POST", {
      creation_id: containerId,
    });
  }

  /**
   * Convenience: Create and publish a text post in one call
   */
  async publishTextPost(text: string, replyControl?: "everyone" | "accounts_you_follow" | "mentioned_only"): Promise<PublishResponse> {
    const container = await this.createMediaContainer({ text, replyControl });
    // Wait briefly for container processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.publishContainer(container.id);
  }

  /**
   * Convenience: Reply to a thread
   */
  async replyToThread(threadId: string, text: string): Promise<PublishResponse> {
    const container = await this.createMediaContainer({ text, replyToId: threadId });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.publishContainer(container.id);
  }

  // ── Content Retrieval ──────────────────────────────────────

  async getUserThreads(
    fields?: string,
    limit?: number,
    since?: string,
    until?: string
  ): Promise<PaginatedResponse<ThreadsMedia>> {
    const userId = await this.getUserId();
    const defaultFields = "id,media_type,text,timestamp,permalink,username,is_quote_post,shortcode,topic_tag";
    const params: Record<string, unknown> = {
      fields: fields || defaultFields,
    };
    if (limit) params.limit = limit;
    if (since) params.since = since;
    if (until) params.until = until;
    return this.request<PaginatedResponse<ThreadsMedia>>(`${userId}/threads`, "GET", params);
  }

  async getThread(
    threadId: string,
    fields?: string
  ): Promise<ThreadsMedia> {
    const defaultFields = "id,media_type,text,timestamp,permalink,username,is_quote_post,shortcode,topic_tag";
    return this.request<ThreadsMedia>(threadId, "GET", {
      fields: fields || defaultFields,
    });
  }

  // ── Replies ────────────────────────────────────────────────

  async getReplies(
    threadId: string,
    fields?: string,
    reverse?: boolean
  ): Promise<PaginatedResponse<ThreadsReply>> {
    const defaultFields = "id,text,username,timestamp,media_type,permalink,hide_status";
    const params: Record<string, unknown> = {
      fields: fields || defaultFields,
    };
    if (reverse) params.reverse = true;
    return this.request<PaginatedResponse<ThreadsReply>>(`${threadId}/replies`, "GET", params);
  }

  async getConversation(
    threadId: string,
    fields?: string,
    reverse?: boolean
  ): Promise<PaginatedResponse<ThreadsReply>> {
    const defaultFields = "id,text,username,timestamp,media_type,permalink,hide_status";
    const params: Record<string, unknown> = {
      fields: fields || defaultFields,
    };
    if (reverse) params.reverse = true;
    return this.request<PaginatedResponse<ThreadsReply>>(`${threadId}/conversation`, "GET", params);
  }

  async hideReply(replyId: string, hide: boolean): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(replyId, "POST", { hide });
  }

  // ── Insights ───────────────────────────────────────────────

  async getMediaInsights(
    threadId: string,
    metrics?: string
  ): Promise<{ data: ThreadsInsight[] }> {
    const defaultMetrics = "views,likes,replies,reposts,quotes";
    return this.request<{ data: ThreadsInsight[] }>(`${threadId}/insights`, "GET", {
      metric: metrics || defaultMetrics,
    });
  }

  async getUserInsights(
    metrics?: string,
    since?: number,
    until?: number
  ): Promise<{ data: ThreadsInsight[] }> {
    const userId = await this.getUserId();
    const defaultMetrics = "views,likes,replies,reposts,quotes,followers_count";
    const params: Record<string, unknown> = {
      metric: metrics || defaultMetrics,
    };
    if (since) params.since = since;
    if (until) params.until = until;
    return this.request<{ data: ThreadsInsight[] }>(`${userId}/threads_insights`, "GET", params);
  }

  // ── Publishing Limits ──────────────────────────────────────

  async getPublishingLimit(): Promise<ThreadsPublishingLimit> {
    const userId = await this.getUserId();
    const response = await this.request<{ data: ThreadsPublishingLimit[] }>(
      `${userId}/threads_publishing_limit`,
      "GET",
      { fields: "quota_usage,config,reply_quota_usage,reply_config" }
    );
    return response.data[0];
  }

  // ── Delete ─────────────────────────────────────────────────

  async deleteThread(threadId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(threadId, "DELETE");
  }

  // ── Search (Public Posts) ──────────────────────────────────

  async searchPosts(
    query: string,
    mediaType?: "TEXT_POST" | "IMAGE" | "VIDEO",
    since?: string,
    until?: string
  ): Promise<PaginatedResponse<ThreadsMedia>> {
    const params: Record<string, unknown> = {
      q: query,
      fields: "id,media_type,text,timestamp,permalink,username,topic_tag",
    };
    if (mediaType) params.media_type = mediaType;
    if (since) params.since = since;
    if (until) params.until = until;
    return this.request<PaginatedResponse<ThreadsMedia>>("keyword_search", "GET", params);
  }
}
