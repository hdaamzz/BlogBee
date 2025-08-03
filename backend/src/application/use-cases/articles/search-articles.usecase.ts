import { injectable, inject } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';
import { ArticleMapper } from '../../mappers/article.mapper';
import { ArticleListResponseDto, SearchArticlesDto } from '../../dtos/article.dto';
import { ISearchArticlesUseCase } from '../../../domain/user-cases/articles/ISearch-articles.usecase';

@injectable()
export class SearchArticlesUseCase implements ISearchArticlesUseCase{
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {}

  async execute(dto: SearchArticlesDto): Promise<ArticleListResponseDto> {
    if (!dto.query.trim()) {
      throw new Error('Search query is required');
    }

    const page = dto.page || 1;
    const limit = Math.min(dto.limit || 10, 50);
    
    const result = await this.articleRepository.search(dto.query, page, limit);
    
    return ArticleMapper.toArticleListResponseDto(
      result.articles, 
      result.total, 
      page, 
      limit
    );
  }
}
