export interface CreateArticleDto {
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
}
export interface CreateArticleDto {
  title: string;
  excerpt: string;
  content: string;
  tags?: string[];
}
export interface ArticleResponseDto {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author: {
    id: string;
    username: string;
    email: string;
  };
}
export interface ArticleListItemDto {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  slug: string;
  createdAt: string;
  publishedAt?: string;
  author: {
    id: string;
    username: string;
  };
}

export interface ArticleListResponseDto {
  articles: ArticleListItemDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface UserArticleResponseDto {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
export interface UpdateArticleDto {
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
}
export interface GetArticlesDto {
  page?: number;
  limit?: number;
}
export interface SearchArticlesDto {
  query: string;
  page?: number;
  limit?: number;
}
