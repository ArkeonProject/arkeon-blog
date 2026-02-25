export interface LabPostListItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    cover_image?: string;
    published_at: string;
    language?: string;
    tags: string[];
    difficulty?: string | null;
}

export interface LabPostDetail {
    title: string;
    content: string;
    cover_image?: string;
    author: string;
    published_at: string;
    language?: string;
    tags: string[];
    difficulty?: string | null;
}
