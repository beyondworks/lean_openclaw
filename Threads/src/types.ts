/**
 * Threads API Type Definitions
 */

export interface ThreadsUser {
  id: string;
  username: string;
  name?: string;
  threads_profile_picture_url?: string;
  threads_biography?: string;
  is_verified?: boolean;
}

export interface ThreadsMedia {
  id: string;
  media_type: "TEXT_POST" | "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REPOST_FACADE";
  media_url?: string;
  text?: string;
  timestamp: string;
  permalink?: string;
  username?: string;
  is_quote_post?: boolean;
  shortcode?: string;
  thumbnail_url?: string;
  children?: { data: ThreadsMedia[] };
  topic_tag?: string;
}

export interface ThreadsReply {
  id: string;
  text?: string;
  username?: string;
  timestamp: string;
  media_type: string;
  permalink?: string;
  hide_status?: "NOT_HUSHED" | "UNHUSHED" | "HIDDEN" | "COVERED";
}

export interface ThreadsInsight {
  name: string;
  period: string;
  values: Array<{ value: number }>;
  title: string;
  description: string;
  id: string;
}

export interface ThreadsPublishingLimit {
  quota_usage: number;
  config: {
    quota_total: number;
    quota_duration: number;
  };
  reply_quota_usage?: number;
  reply_config?: {
    quota_total: number;
    quota_duration: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    };
    next?: string;
    previous?: string;
  };
}

export interface MediaContainerResponse {
  id: string;
}

export interface PublishResponse {
  id: string;
}

export interface ThreadsApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}
