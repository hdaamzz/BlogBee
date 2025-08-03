import { injectable, inject } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';

import { ArticleMapper } from '../../mappers/article.mapper';
import { ArticleResponseDto, UpdateArticleDto } from '../../dtos/article.dto';
import { IUpdateArticleUseCase } from '../../../domain/user-cases/articles/IUpdate-article.usecase';

@injectable()
export class UpdateArticleUseCase implements IUpdateArticleUseCase{
  constructor(
    @inject("ArticleRepository") private articleRepository: IArticleRepository
  ) {}

  async execute(articleId: string, dto: UpdateArticleDto, authorId: string): Promise<ArticleResponseDto> {
    const existingArticle = await this.articleRepository.findByIdUserNotPopulated(articleId);
    
    if (!existingArticle) {
      throw new Error('Article not found');
    }

    if (existingArticle.authorId !== authorId) {
      throw new Error('Unauthorized to update this article');
    }

    if (dto.title && dto.title.length < 5) {
      throw new Error('Article title must be at least 5 characters long');
    }

    if (dto.excerpt && dto.excerpt.length < 20) {
      throw new Error('Article excerpt must be at least 20 characters long');
    }

    if (dto.content && dto.content.length < 50) {
      throw new Error('Article content must be at least 50 characters long');
    }

    const updateData: any = {};
    if (dto.title) updateData.title = dto.title.trim();
    if (dto.excerpt) updateData.excerpt = dto.excerpt.trim();
    if (dto.content) updateData.content = dto.content.trim();
    if (dto.tags !== undefined) updateData.tags = dto.tags;
    

    const updatedArticle = await this.articleRepository.update(articleId, updateData);

    if (!updatedArticle) {
      throw new Error('Failed to update article');
    }

    return ArticleMapper.toArticleResponseDto(updatedArticle);
  }
}
