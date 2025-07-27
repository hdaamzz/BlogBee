import { injectable } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';
import { IArticle, ICreateArticle, IUpdateArticle } from '../../../domain/entities/article.entity';
import ArticleModel, { IArticleDocument } from '../models/article.model';
import { BaseRepository } from './base.repository';

@injectable()
export class ArticleRepository extends BaseRepository<IArticleDocument, IArticle> implements IArticleRepository {
  constructor() {
    super(ArticleModel);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now();
  }

  private get authorPopulateOptions() {
    return {
      path: 'authorId',
      select: 'name email'
    };
  }

  async create(article: ICreateArticle & { authorId: string }): Promise<IArticle> {
    const slug = this.generateSlug(article.title);
    
    const articleDoc = await this.createDocument({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tags: article.tags || [],
      slug,
      authorId: article.authorId,
      viewCount: 0
    });

    await articleDoc.populate(this.authorPopulateOptions);
    return this.mapToEntity(articleDoc);
  }

  async findById(id: string): Promise<IArticle | null> {
    const articleDoc = await this.findOneById(id);
    if (!articleDoc) return null;

    await articleDoc.populate(this.authorPopulateOptions);
    return this.mapToEntity(articleDoc);
  }

  async findByIdUserNotPopulated(id: string): Promise<IArticle | null> {
    const articleDoc = await this.findOneById(id);
    return articleDoc ? this.mapToEntity(articleDoc) : null;
  }

  async findBySlug(slug: string): Promise<IArticle | null> {
    const articleDoc = await this.findOneByFilter({ slug });
    if (!articleDoc) return null;

    await articleDoc.populate(this.authorPopulateOptions);
    return this.mapToEntity(articleDoc);
  }

  async findByAuthorId(authorId: string): Promise<IArticle[]> {
    const articleDocs = await this.findManyByFilter(
      { authorId },
      {
        sort: { createdAt: -1 },
        populate: this.authorPopulateOptions
      }
    );

    return articleDocs.map(doc => this.mapToEntity(doc));
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ articles: IArticle[]; total: number }> {
    const { documents, total } = await this.findWithPagination(
      {},
      page,
      limit,
      {
        sort: { createdAt: -1 },
        populate: this.authorPopulateOptions
      }
    );

    const articles = documents.map(doc => this.mapToEntity(doc));
    return { articles, total };
  }

  async update(id: string, article: Partial<IUpdateArticle>): Promise<IArticle | null> {
    const updateData: any = { ...article };
    
    if (article.title) {
      updateData.slug = this.generateSlug(article.title);
    }

    const existingArticle = await this.findOneById(id);
    if (existingArticle) {
      updateData.publishedAt = new Date();
    }

    const updatedArticle = await this.updateById(id, updateData);
    if (!updatedArticle) return null;

    await updatedArticle.populate(this.authorPopulateOptions);
    return this.mapToEntity(updatedArticle);
  }

  async delete(id: string): Promise<boolean> {
    return await this.deleteById(id);
  }

  async search(query: string, page: number = 1, limit: number = 10): Promise<{ articles: IArticle[]; total: number }> {
    const searchFilter = {
      $and: [
        {
          $or: [
            { $text: { $search: query } },
            { title: { $regex: query, $options: 'i' } },
            { excerpt: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } }
          ]
        }
      ]
    };

    const { documents, total } = await this.findWithPagination(
      searchFilter,
      page,
      limit,
      {
        sort: { createdAt: -1 },
        populate: this.authorPopulateOptions
      }
    );

    const articles = documents.map(doc => this.mapToEntity(doc));
    return { articles, total };
  }

  protected mapToEntity(articleDoc: IArticleDocument): IArticle {
    return {
      id: articleDoc._id.toString(),
      title: articleDoc.title,
      excerpt: articleDoc.excerpt,
      content: articleDoc.content,
      tags: articleDoc.tags,
      slug: articleDoc.slug,
      authorId: articleDoc.authorId.toString(),
      author: articleDoc.authorId && typeof articleDoc.authorId === 'object' ? {
        id: (articleDoc.authorId as any)._id?.toString() || articleDoc.authorId.toString(),
        username: (articleDoc.authorId as any).name || '',
        email: (articleDoc.authorId as any).email || ''
      } : undefined,
      publishedAt: articleDoc.publishedAt,
      createdAt: articleDoc.createdAt,
      updatedAt: articleDoc.updatedAt
    };
  }
}
