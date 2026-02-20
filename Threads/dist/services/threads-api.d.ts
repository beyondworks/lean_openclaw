/**
 * Threads API Client
 * Handles all HTTP communication with Meta's Threads Graph API
 */
import type { ThreadsUser, ThreadsMedia, ThreadsReply, ThreadsInsight, ThreadsPublishingLimit, PaginatedResponse, MediaContainerResponse, PublishResponse } from "../types.js";
export declare class ThreadsApiClient {
    private accessToken;
    private userId;
    constructor(accessToken: string);
    private request;
    private parseError;
    getMe(fields?: string): Promise<ThreadsUser>;
    getUserId(): Promise<string>;
    /**
     * Step 1: Create a media container (text, image, video, or carousel item)
     */
    createMediaContainer(opts: {
        text?: string;
        imageUrl?: string;
        videoUrl?: string;
        mediaType?: "TEXT" | "IMAGE" | "VIDEO" | "CAROUSEL";
        isCarouselItem?: boolean;
        replyToId?: string;
        children?: string[];
        replyControl?: "everyone" | "accounts_you_follow" | "mentioned_only";
    }): Promise<MediaContainerResponse>;
    /**
     * Step 2: Publish the container
     */
    publishContainer(containerId: string): Promise<PublishResponse>;
    /**
     * Convenience: Create and publish a text post in one call
     */
    publishTextPost(text: string, replyControl?: "everyone" | "accounts_you_follow" | "mentioned_only"): Promise<PublishResponse>;
    /**
     * Convenience: Reply to a thread
     */
    replyToThread(threadId: string, text: string): Promise<PublishResponse>;
    getUserThreads(fields?: string, limit?: number, since?: string, until?: string): Promise<PaginatedResponse<ThreadsMedia>>;
    getThread(threadId: string, fields?: string): Promise<ThreadsMedia>;
    getReplies(threadId: string, fields?: string, reverse?: boolean): Promise<PaginatedResponse<ThreadsReply>>;
    getConversation(threadId: string, fields?: string, reverse?: boolean): Promise<PaginatedResponse<ThreadsReply>>;
    hideReply(replyId: string, hide: boolean): Promise<{
        success: boolean;
    }>;
    getMediaInsights(threadId: string, metrics?: string): Promise<{
        data: ThreadsInsight[];
    }>;
    getUserInsights(metrics?: string, since?: number, until?: number): Promise<{
        data: ThreadsInsight[];
    }>;
    getPublishingLimit(): Promise<ThreadsPublishingLimit>;
    deleteThread(threadId: string): Promise<{
        success: boolean;
    }>;
    searchPosts(query: string, mediaType?: "TEXT_POST" | "IMAGE" | "VIDEO", since?: string, until?: string): Promise<PaginatedResponse<ThreadsMedia>>;
}
//# sourceMappingURL=threads-api.d.ts.map