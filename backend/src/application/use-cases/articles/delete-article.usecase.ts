import { injectable, inject } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';
import { IDeleteArticleUseCase } from '../../../domain/user-cases/articles/IDelete-article.usecase';

@injectable()
export class DeleteArticleUseCase implements IDeleteArticleUseCase{
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {}

  async execute(articleId: string, authorId: string): Promise<void> {
    const article = await this.articleRepository.findByIdUserNotPopulated(articleId);
    
    if (!article) {
      throw new Error('Article not found');
    }

    if (article.authorId !== authorId) {
      throw new Error('Unauthorized to delete this article');
    }

    const deleted = await this.articleRepository.delete(articleId);
    
    if (!deleted) {
      throw new Error('Failed to delete article');
    }
  }
}
