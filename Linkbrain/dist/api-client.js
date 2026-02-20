/**
 * Linkbrain API Client
 *
 * HTTP client for Linkbrain v1 API.
 * All requests authenticated via X-API-Key header.
 */
export class LinkbrainClient {
    apiKey;
    baseUrl;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl.replace(/\/$/, '');
    }
    async request(method, path, body, query) {
        const url = new URL(`${this.baseUrl}/api/v1${path}`);
        if (query) {
            Object.entries(query).forEach(([k, v]) => {
                if (v !== undefined && v !== '')
                    url.searchParams.set(k, v);
            });
        }
        const response = await fetch(url.toString(), {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
        });
        const json = await response.json();
        if (!response.ok || json.success === false) {
            const errMsg = json.error?.message || `API error ${response.status}: ${response.statusText}`;
            const errCode = json.error?.code || 'UNKNOWN_ERROR';
            throw new Error(`[${errCode}] ${errMsg}`);
        }
        return (json.data !== undefined ? json.data : json);
    }
    // ── Clips ─────────────────────────────────────────
    async listClips(params) {
        const query = {};
        if (params) {
            if (params.category)
                query.category = params.category;
            if (params.platform)
                query.platform = params.platform;
            if (params.collectionId)
                query.collectionId = params.collectionId;
            if (params.isFavorite !== undefined)
                query.isFavorite = String(params.isFavorite);
            if (params.isReadLater !== undefined)
                query.isReadLater = String(params.isReadLater);
            if (params.isArchived !== undefined)
                query.isArchived = String(params.isArchived);
            if (params.from)
                query.from = params.from;
            if (params.to)
                query.to = params.to;
            if (params.search)
                query.search = params.search;
            if (params.limit)
                query.limit = String(params.limit);
            if (params.offset)
                query.offset = String(params.offset);
            if (params.sort)
                query.sort = params.sort;
            if (params.order)
                query.order = params.order;
            if (params.includeContent)
                query.content = 'true';
        }
        return this.request('GET', '/clips', undefined, query);
    }
    async getClip(id) {
        return this.request('GET', '/clips-detail', undefined, { id });
    }
    async getClipContent(id) {
        return this.request('GET', '/clips-detail', undefined, { id, content: 'true' });
    }
    async createClip(data) {
        return this.request('POST', '/clips', data);
    }
    async updateClip(id, data) {
        return this.request('PATCH', '/clips-detail', data, { id });
    }
    async deleteClip(id) {
        return this.request('DELETE', '/clips-detail', undefined, { id });
    }
    async searchClips(q, params) {
        const query = { q };
        if (params) {
            if (params.category)
                query.category = params.category;
            if (params.platform)
                query.platform = params.platform;
            if (params.collectionId)
                query.collectionId = params.collectionId;
            if (params.isFavorite !== undefined)
                query.isFavorite = String(params.isFavorite);
            if (params.isReadLater !== undefined)
                query.isReadLater = String(params.isReadLater);
            if (params.limit)
                query.limit = String(params.limit);
            if (params.offset)
                query.offset = String(params.offset);
            if (params.includeContent)
                query.content = 'true';
        }
        return this.request('GET', '/search', undefined, query);
    }
    // ── Collections ───────────────────────────────────
    async listCollections() {
        return this.request('GET', '/collections');
    }
    async createCollection(data) {
        return this.request('POST', '/collections', data);
    }
    async updateCollection(id, data) {
        return this.request('PATCH', '/collections', data, { id });
    }
    async deleteCollection(id) {
        return this.request('DELETE', '/collections', undefined, { id });
    }
    // ── AI ─────────────────────────────────────────────
    async generateContent(data) {
        return this.request('POST', '/ai', { action: 'generate', ...data });
    }
    async analyzeUrl(url) {
        return this.request('POST', '/ai', { action: 'analyze', url });
    }
    async askAI(message, clipIds, language) {
        return this.request('POST', '/ai', { action: 'ask', message, clipIds, language });
    }
    async getInsights(period, days, language) {
        return this.request('POST', '/ai', { action: 'insights', period, days, language });
    }
    // ── Categories ────────────────────────────────────
    async listCategories() {
        return this.request('GET', '/manage', undefined, { action: 'categories' });
    }
    async createCategory(name, color) {
        return this.request('POST', '/manage', { name, color }, { action: 'categories' });
    }
    // ── Tags ──────────────────────────────────────────
    async listTags(limit) {
        // REST API에 독립적인 태그 목록 엔드포인트가 없으므로
        // 전체 클립에서 키워드를 수집하여 빈도순 정렬
        const result = await this.request('GET', '/clips', undefined, { limit: '100' });
        const tagCounts = new Map();
        const clips = Array.isArray(result) ? result : result?.data || [];
        for (const clip of clips) {
            for (const keyword of clip.keywords || []) {
                tagCounts.set(keyword, (tagCounts.get(keyword) || 0) + 1);
            }
        }
        const tags = Array.from(tagCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
        return limit ? tags.slice(0, limit) : tags;
    }
    async searchByTags(tags, match, limit, offset) {
        const query = {
            action: 'tags',
            tags: tags.join(','),
        };
        if (match)
            query.match = match;
        if (limit)
            query.limit = String(limit);
        if (offset)
            query.offset = String(offset);
        return this.request('GET', '/manage', undefined, query);
    }
    // ── Bulk ──────────────────────────────────────────
    async bulkUpdate(data) {
        return this.request('POST', '/manage', data, { action: 'bulk' });
    }
    // ── Webhooks ──────────────────────────────────────
    async listWebhooks() {
        return this.request('GET', '/manage', undefined, { action: 'webhooks' });
    }
    async createWebhook(url, events, label) {
        return this.request('POST', '/manage', { url, events, label }, { action: 'webhooks' });
    }
    async deleteWebhook(id) {
        return this.request('DELETE', '/manage', undefined, { action: 'webhooks', id });
    }
}
