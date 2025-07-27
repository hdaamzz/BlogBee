import { injectable, inject } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';
import { ArticleMapper } from '../../mappers/article.mapper';
import { ArticleResponseDto, CreateArticleDto } from '../../dtos/article.dto';

@injectable()
export class CreateArticleUseCase {
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {}

  async execute(dto: CreateArticleDto, authorId: string): Promise<ArticleResponseDto> {
    if (!dto.title?.trim()) {
      throw new Error('Article title is required');
    }

    if (!dto.excerpt?.trim()) {
      throw new Error('Article excerpt is required');
    }

    if (!dto.content?.trim()) {
      throw new Error('Article content is required');
    }

    if (dto.title.length < 5) {
      throw new Error('Article title must be at least 5 characters long');
    }

    if (dto.excerpt.length < 20) {
      throw new Error('Article excerpt must be at least 20 characters long');
    }

    if (dto.content.length < 50) {
      throw new Error('Article content must be at least 50 characters long');
    }

    const article = await this.articleRepository.create({
      title: dto.title.trim(),
      excerpt: dto.excerpt.trim(),
      content: dto.content.trim(),
      tags: dto.tags || [],
      authorId
    });

    return ArticleMapper.toArticleResponseDto(article);
  }
}
