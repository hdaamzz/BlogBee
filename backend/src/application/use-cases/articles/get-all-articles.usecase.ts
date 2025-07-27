import { injectable, inject } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';

import { ArticleMapper } from '../../mappers/article.mapper';
import { ArticleListResponseDto, GetArticlesDto } from '../../dtos/article.dto';

@injectable()
export class GetAllArticlesUseCase {
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {}

  async execute(dto: GetArticlesDto): Promise<ArticleListResponseDto> {
    const page = dto.page || 1;
    const limit = Math.min(dto.limit || 10, 50);
    
    const result = await this.articleRepository.findAll(page, limit);
    
    return ArticleMapper.toArticleListResponseDto(
      result.articles, 
      result.total, 
      page, 
      limit
    );
  }
}
