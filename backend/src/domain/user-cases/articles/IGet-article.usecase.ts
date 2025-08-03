import { IArticle } from '../../../domain/entities/article.entity';

export interface IGetArticleUseCase {
  execute(slug: string): Promise<IArticle>;
}
