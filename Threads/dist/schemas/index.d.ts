/**
 * Zod Schemas for Threads MCP Server Tools
 */
import { z } from "zod";
export declare const ResponseFormatSchema: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
export declare const CreatePostSchema: z.ZodObject<{
    text: z.ZodString;
    image_url: z.ZodOptional<z.ZodString>;
    video_url: z.ZodOptional<z.ZodString>;
    reply_control: z.ZodOptional<z.ZodEnum<["everyone", "accounts_you_follow", "mentioned_only"]>>;
}, "strict", z.ZodTypeAny, {
    text: string;
    image_url?: string | undefined;
    video_url?: string | undefined;
    reply_control?: "everyone" | "accounts_you_follow" | "mentioned_only" | undefined;
}, {
    text: string;
    image_url?: string | undefined;
    video_url?: string | undefined;
    reply_control?: "everyone" | "accounts_you_follow" | "mentioned_only" | undefined;
}>;
export declare const ReplyToThreadSchema: z.ZodObject<{
    thread_id: z.ZodString;
    text: z.ZodString;
}, "strict", z.ZodTypeAny, {
    text: string;
    thread_id: string;
}, {
    text: string;
    thread_id: string;
}>;
export declare const GetMyThreadsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    since: z.ZodOptional<z.ZodString>;
    until: z.ZodOptional<z.ZodString>;
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    limit: number;
    response_format: "markdown" | "json";
    since?: string | undefined;
    until?: string | undefined;
}, {
    limit?: number | undefined;
    since?: string | undefined;
    until?: string | undefined;
    response_format?: "markdown" | "json" | undefined;
}>;
export declare const GetThreadSchema: z.ZodObject<{
    thread_id: z.ZodString;
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    thread_id: string;
    response_format: "markdown" | "json";
}, {
    thread_id: string;
    response_format?: "markdown" | "json" | undefined;
}>;
export declare const GetRepliesSchema: z.ZodObject<{
    thread_id: z.ZodString;
    reverse: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    thread_id: string;
    response_format: "markdown" | "json";
    reverse?: boolean | undefined;
}, {
    thread_id: string;
    reverse?: boolean | undefined;
    response_format?: "markdown" | "json" | undefined;
}>;
export declare const HideReplySchema: z.ZodObject<{
    reply_id: z.ZodString;
    hide: z.ZodBoolean;
}, "strict", z.ZodTypeAny, {
    hide: boolean;
    reply_id: string;
}, {
    hide: boolean;
    reply_id: string;
}>;
export declare const GetPostInsightsSchema: z.ZodObject<{
    thread_id: z.ZodString;
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    thread_id: string;
    response_format: "markdown" | "json";
}, {
    thread_id: string;
    response_format?: "markdown" | "json" | undefined;
}>;
export declare const GetAccountInsightsSchema: z.ZodObject<{
    since: z.ZodOptional<z.ZodNumber>;
    until: z.ZodOptional<z.ZodNumber>;
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    response_format: "markdown" | "json";
    since?: number | undefined;
    until?: number | undefined;
}, {
    since?: number | undefined;
    until?: number | undefined;
    response_format?: "markdown" | "json" | undefined;
}>;
export declare const GetPublishingLimitSchema: z.ZodObject<{
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    response_format: "markdown" | "json";
}, {
    response_format?: "markdown" | "json" | undefined;
}>;
export declare const DeleteThreadSchema: z.ZodObject<{
    thread_id: z.ZodString;
}, "strict", z.ZodTypeAny, {
    thread_id: string;
}, {
    thread_id: string;
}>;
export declare const SearchPostsSchema: z.ZodObject<{
    query: z.ZodString;
    media_type: z.ZodOptional<z.ZodEnum<["TEXT_POST", "IMAGE", "VIDEO"]>>;
    since: z.ZodOptional<z.ZodString>;
    until: z.ZodOptional<z.ZodString>;
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    response_format: "markdown" | "json";
    query: string;
    media_type?: "TEXT_POST" | "IMAGE" | "VIDEO" | undefined;
    since?: string | undefined;
    until?: string | undefined;
}, {
    query: string;
    media_type?: "TEXT_POST" | "IMAGE" | "VIDEO" | undefined;
    since?: string | undefined;
    until?: string | undefined;
    response_format?: "markdown" | "json" | undefined;
}>;
export declare const GetProfileSchema: z.ZodObject<{
    response_format: z.ZodDefault<z.ZodEnum<["markdown", "json"]>>;
}, "strict", z.ZodTypeAny, {
    response_format: "markdown" | "json";
}, {
    response_format?: "markdown" | "json" | undefined;
}>;
//# sourceMappingURL=index.d.ts.map