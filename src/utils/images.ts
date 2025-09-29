import type { Book } from "../types/book";

export function normalizeGenres(g: Book['genres']): string[] {
    if (Array.isArray(g)) return g.map(String);
    if (typeof g === 'string') return g.split(',').map(s => s.trim()).filter(Boolean);
    return [];
}

const OL_RE = /covers\.openlibrary\.org\/b\/(?:isbn|id)\/([^./]+)-([SML])\.jpg(?:.*)?$/i;

export function isOpenLibraryUrl(url?: string): boolean {
    return !!url && OL_RE.test(url);
}

export function toOpenLibVariant(url: string, size: 'S' | 'M' | 'L' = 'L'): string {
    return url.replace(OL_RE, (_m, id) => `covers.openlibrary.org/b/isbn/${id}-${size}.jpg`);
}

export function buildSrcSet(url?: string, kind: 'thumb' | 'hero' = 'thumb'): { src: string; srcSet?: string } {
    if (!url) return { src: '' };
    if (!isOpenLibraryUrl(url)) return { src: url }; // ostale domene ne diramo

    if (kind === 'thumb') {
        const m = toOpenLibVariant(url, 'M');
        const l = toOpenLibVariant(url, 'L');
        return { src: m, srcSet: `${m} 1x, ${l} 2x` };
    }
    const l = toOpenLibVariant(url, 'L');
    return { src: l };
}

export function posterFor(b: Book) {
    return b.image_url || `https://placehold.co/1200x360?text=${encodeURIComponent(b.title)}`;
}



