import { injectable, inject } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';
import { UserArticleResponseDto } from '../../dtos/article.dto';
import { ArticleMapper } from '../../mappers/article.mapper';

@injectable()
export class GetUserArticlesUseCase {
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {}

  async execute(authorId: string): Promise<UserArticleResponseDto[]> {
    const articles = await this.articleRepository.findByAuthorId(authorId);
    return articles.map(article => ArticleMapper.toUserArticleResponseDto(article));
  }
}
