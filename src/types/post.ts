export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image?: string;
  published_at: string;
  language?: string;
}

export interface PostDetail {
  title: string;
  content: string;
  cover_image?: string;
  author: string;
  published_at: string;
  language?: string;
}