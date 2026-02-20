/**
 * Linkbrain API Client
 *
 * HTTP client for Linkbrain v1 API.
 * All requests authenticated via X-API-Key header.
 */
export interface LinkbrainConfig {
    apiKey: string;
    baseUrl: string;
}
export declare class LinkbrainClient {
    private apiKey;
    private baseUrl;
    constructor(config: LinkbrainConfig);
    private request;
    listClips(params?: {
        category?: string;
        platform?: string;
        collectionId?: string;
        isFavorite?: boolean;
        isReadLater?: boolean;
        isArchived?: boolean;
        from?: string;
        to?: string;
        search?: string;
        limit?: number;
        offset?: number;
        sort?: string;
        order?: string;
        includeContent?: boolean;
    }): Promise<unknown>;
    getClip(id: string): Promise<unknown>;
    getClipContent(id: string): Promise<unknown>;
    createClip(data: {
        url: string;
        title?: string;
        summary?: string;
        category?: string;
        keywords?: string[];
        notes?: string;
        collectionIds?: string[];
    }): Promise<unknown>;
    updateClip(id: string, data: Record<string, unknown>): Promise<unknown>;
    deleteClip(id: string): Promise<unknown>;
    searchClips(q: string, params?: {
        category?: string;
        platform?: string;
        collectionId?: string;
        isFavorite?: boolean;
        isReadLater?: boolean;
        limit?: number;
        offset?: number;
        includeContent?: boolean;
    }): Promise<unknown>;
    listCollections(): Promise<unknown>;
    createCollection(data: {
        name: string;
        color?: string;
        isPublic?: boolean;
    }): Promise<unknown>;
    updateCollection(id: string, data: Record<string, unknown>): Promise<unknown>;
    deleteCollection(id: string): Promise<unknown>;
    generateContent(data: {
        type: string;
        clipIds: string[];
        language?: string;
    }): Promise<unknown>;
    analyzeUrl(url: string): Promise<unknown>;
    askAI(message: string, clipIds?: string[], language?: string): Promise<unknown>;
    getInsights(period?: string, days?: number, language?: string): Promise<unknown>;
    listCategories(): Promise<unknown>;
    createCategory(name: string, color?: string): Promise<unknown>;
    listTags(limit?: number): Promise<{
        name: string;
        count: number;
    }[]>;
    searchByTags(tags: string[], match?: string, limit?: number, offset?: number): Promise<unknown>;
    bulkUpdate(data: {
        action: string;
        ids: string[];
        category?: string;
        tags?: string[];
        value?: boolean;
    }): Promise<unknown>;
    listWebhooks(): Promise<unknown>;
    createWebhook(url: string, events: string[], label?: string): Promise<unknown>;
    deleteWebhook(id: string): Promise<unknown>;
}
