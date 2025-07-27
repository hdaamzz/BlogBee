import { IArticle, ICreateArticle, IUpdateArticle } from '../../entities/article.entity';

export interface IArticleRepository {
  create(article: ICreateArticle & { authorId: string }): Promise<IArticle>;
  findById(id: string): Promise<IArticle | null>;
  findByIdUserNotPopulated(id: string): Promise<IArticle | null>;
  findBySlug(slug: string): Promise<IArticle | null>;
  findByAuthorId(authorId: string): Promise<IArticle[]>;
  findAll(page?: number, limit?: number): Promise<{ articles: IArticle[]; total: number }>;
  update(id: string, article: Partial<IUpdateArticle>): Promise<IArticle | null>;
  delete(id: string): Promise<boolean>;
  search(query: string, page?: number, limit?: number): Promise<{ articles: IArticle[]; total: number }>;
}
