import { injectable, inject } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';
import { IArticle } from '../../../domain/entities/article.entity';

@injectable()
export class GetArticleUseCase {
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {}

  async execute(articleId: string, incrementView: boolean = false): Promise<IArticle> {
    const article = await this.articleRepository.findById(articleId);
    
    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }
}
