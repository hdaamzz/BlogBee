export interface IArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  authorId: string;
  author?: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  slug: string;
}

export interface IArticlePopulate {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  authorId: {
    _id: string;
    username: string;
    email: string;
  };
  author?: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  isPublished: boolean;
  slug: string;
}

export interface ICreateArticle {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export interface IUpdateArticle {
  id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  isPublished?: boolean;
}