import { IArticle } from '../../domain/entities/article.entity';
import { ArticleListResponseDto } from '../dtos/article.dto';
import { ArticleResponseDto, ArticleListItemDto, UserArticleResponseDto } from '../dtos/article.dto';

export class ArticleMapper {
  static toArticleResponseDto(article: IArticle): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tags: article.tags,
      slug: article.slug,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      publishedAt: article.publishedAt?.toISOString(),
      author: {
        id: article.author?.id || article.authorId,
        username: article.author?.username || '',
        email: article.author?.email || ''
      }
    };
  }

  static toArticleListItemDto(article: IArticle): ArticleListItemDto {
    return {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      tags: article.tags,
      slug: article.slug,
      createdAt: article.createdAt.toISOString(),
      publishedAt: article.publishedAt?.toISOString(),
      author: {
        id: article.author?.id || article.authorId,
        username: article.author?.username || ''
      }
    };
  }

  static toUserArticleResponseDto(article: IArticle): UserArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      tags: article.tags,
      slug: article.slug,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      publishedAt: article.publishedAt?.toISOString()
    };
  }

  static toArticleListResponseDto(
    articles: IArticle[], 
    total: number, 
    page: number, 
    limit: number
  ): ArticleListResponseDto {
    return {
      articles: articles.map(article => this.toArticleListItemDto(article)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
