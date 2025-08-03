import { injectable, inject } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';
import { IArticle } from '../../../domain/entities/article.entity';
import { IGetArticleUseCase } from '../../../domain/user-cases/articles/IGet-article.usecase';

@injectable()
export class GetArticleUseCase implements IGetArticleUseCase{
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {}

  async execute(slug: string): Promise<IArticle> {
    const article = await this.articleRepository.findBySlug(slug);
    
    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }
}
