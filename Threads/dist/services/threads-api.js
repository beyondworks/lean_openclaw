/**
 * Threads API Client
 * Handles all HTTP communication with Meta's Threads Graph API
 */
import axios, { AxiosError } from "axios";
import { THREADS_API_BASE } from "../constants.js";
export class ThreadsApiClient {
    accessToken;
    userId = null;
    constructor(accessToken) {
        this.accessToken = accessToken;
    }
    // ── Generic Request ────────────────────────────────────────
    async request(endpoint, method = "GET", params, data) {
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
        }
        catch (error) {
            throw this.parseError(error);
        }
    }
    parseError(error) {
        if (error instanceof AxiosError && error.response?.data) {
            const apiError = error.response.data;
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
    async getMe(fields) {
        const defaultFields = "id,username,name,threads_profile_picture_url,threads_biography,is_verified";
        const result = await this.request("me", "GET", {
            fields: fields || defaultFields,
        });
        this.userId = result.id;
        return result;
    }
    async getUserId() {
        if (this.userId)
            return this.userId;
        const me = await this.getMe("id");
        return me.id;
    }
    // ── Publishing ─────────────────────────────────────────────
    /**
     * Step 1: Create a media container (text, image, video, or carousel item)
     */
    async createMediaContainer(opts) {
        const userId = await this.getUserId();
        const params = {};
        if (opts.text)
            params.text = opts.text;
        if (opts.imageUrl)
            params.image_url = opts.imageUrl;
        if (opts.videoUrl)
            params.video_url = opts.videoUrl;
        if (opts.replyToId)
            params.reply_to_id = opts.replyToId;
        if (opts.replyControl)
            params.reply_control = opts.replyControl;
        if (opts.mediaType === "CAROUSEL") {
            params.media_type = "CAROUSEL";
            if (opts.children)
                params.children = opts.children.join(",");
        }
        else if (opts.imageUrl) {
            params.media_type = "IMAGE";
        }
        else if (opts.videoUrl) {
            params.media_type = "VIDEO";
        }
        else {
            params.media_type = "TEXT";
        }
        if (opts.isCarouselItem) {
            params.is_carousel_item = true;
        }
        return this.request(`${userId}/threads`, "POST", params);
    }
    /**
     * Step 2: Publish the container
     */
    async publishContainer(containerId) {
        const userId = await this.getUserId();
        return this.request(`${userId}/threads_publish`, "POST", {
            creation_id: containerId,
        });
    }
    /**
     * Convenience: Create and publish a text post in one call
     */
    async publishTextPost(text, replyControl) {
        const container = await this.createMediaContainer({ text, replyControl });
        // Wait briefly for container processing
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.publishContainer(container.id);
    }
    /**
     * Convenience: Reply to a thread
     */
    async replyToThread(threadId, text) {
        const container = await this.createMediaContainer({ text, replyToId: threadId });
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.publishContainer(container.id);
    }
    // ── Content Retrieval ──────────────────────────────────────
    async getUserThreads(fields, limit, since, until) {
        const userId = await this.getUserId();
        const defaultFields = "id,media_type,text,timestamp,permalink,username,is_quote_post,shortcode,topic_tag";
        const params = {
            fields: fields || defaultFields,
        };
        if (limit)
            params.limit = limit;
        if (since)
            params.since = since;
        if (until)
            params.until = until;
        return this.request(`${userId}/threads`, "GET", params);
    }
    async getThread(threadId, fields) {
        const defaultFields = "id,media_type,text,timestamp,permalink,username,is_quote_post,shortcode,topic_tag";
        return this.request(threadId, "GET", {
            fields: fields || defaultFields,
        });
    }
    // ── Replies ────────────────────────────────────────────────
    async getReplies(threadId, fields, reverse) {
        const defaultFields = "id,text,username,timestamp,media_type,permalink,hide_status";
        const params = {
            fields: fields || defaultFields,
        };
        if (reverse)
            params.reverse = true;
        return this.request(`${threadId}/replies`, "GET", params);
    }
    async getConversation(threadId, fields, reverse) {
        const defaultFields = "id,text,username,timestamp,media_type,permalink,hide_status";
        const params = {
            fields: fields || defaultFields,
        };
        if (reverse)
            params.reverse = true;
        return this.request(`${threadId}/conversation`, "GET", params);
    }
    async hideReply(replyId, hide) {
        return this.request(replyId, "POST", { hide });
    }
    // ── Insights ───────────────────────────────────────────────
    async getMediaInsights(threadId, metrics) {
        const defaultMetrics = "views,likes,replies,reposts,quotes";
        return this.request(`${threadId}/insights`, "GET", {
            metric: metrics || defaultMetrics,
        });
    }
    async getUserInsights(metrics, since, until) {
        const userId = await this.getUserId();
        const defaultMetrics = "views,likes,replies,reposts,quotes,followers_count";
        const params = {
            metric: metrics || defaultMetrics,
        };
        if (since)
            params.since = since;
        if (until)
            params.until = until;
        return this.request(`${userId}/threads_insights`, "GET", params);
    }
    // ── Publishing Limits ──────────────────────────────────────
    async getPublishingLimit() {
        const userId = await this.getUserId();
        const response = await this.request(`${userId}/threads_publishing_limit`, "GET", { fields: "quota_usage,config,reply_quota_usage,reply_config" });
        return response.data[0];
    }
    // ── Delete ─────────────────────────────────────────────────
    async deleteThread(threadId) {
        return this.request(threadId, "DELETE");
    }
    // ── Search (Public Posts) ──────────────────────────────────
    async searchPosts(query, mediaType, since, until) {
        const params = {
            q: query,
            fields: "id,media_type,text,timestamp,permalink,username,topic_tag",
        };
        if (mediaType)
            params.media_type = mediaType;
        if (since)
            params.since = since;
        if (until)
            params.until = until;
        return this.request("keyword_search", "GET", params);
    }
}
//# sourceMappingURL=threads-api.js.map