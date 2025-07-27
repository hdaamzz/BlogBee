import { User } from "./auth.interface";

export interface IArticle {
  id: string;
  title: string;
  content?: string;
  excerpt: string;
  author: any;
  authorId: string;
  isPublished:boolean
  slug:string
  tags: string[];
  updatedAt: string;
  createdAt:string;
}


export interface ICreateArticle {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
}

export interface IUpdateArticle extends Partial<ICreateArticle> {
  id: string;
}

export interface ArticleResponse {
  success: boolean;
  data: IArticle;
  message?: string;
}


export interface ArticlesResponse {
  success: boolean;
  data: IArticle[];
  message?: string;
}

export interface AllarticlesResponse {
  success: boolean;
  data:{
    articles: IArticle[];
    total:number;
    page:number;
    limit:number;
    totalPages:number;
  }
  message?: string;
}

export interface DeleteResponse {
  success: boolean;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

// export interface IUpdateArticle {
//   title: string;
//   excerpt: string;
//   content: string;
//   tags: string[];
// }