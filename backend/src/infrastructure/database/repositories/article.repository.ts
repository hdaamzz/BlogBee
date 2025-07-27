import { injectable } from 'tsyringe';
import { IArticleRepository } from '../../../domain/interfaces/repositories/article.repository.interface';
import { IArticle, ICreateArticle, IUpdateArticle } from '../../../domain/entities/article.entity';
import ArticleModel, { IArticleDocument } from '../models/article.model';
import { log } from 'console';

@injectable()
export class ArticleRepository implements IArticleRepository {
  
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now();
  }

  async create(article: ICreateArticle & { authorId: string }): Promise<IArticle> {
    const slug = this.generateSlug(article.title);
    
    const articleDoc = new ArticleModel({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tags: article.tags || [],
      slug,
      authorId: article.authorId,
      viewCount: 0
    });

    const savedArticle = await articleDoc.save();
    
    await savedArticle.populate({
      path: 'authorId',
      select: 'name email'
    });

    return this.mapToEntity(savedArticle);
  }

  async findById(id: string): Promise<IArticle | null> {
    try {
      const articleDoc = await ArticleModel.findById(id).populate({
        path: 'authorId',
        select: 'name email'
      });
      
      return articleDoc ? this.mapToEntity(articleDoc) : null;
    } catch (error) {
      console.error('Error finding article by id:', error);
      return null;
    }
  }
  async findByIdUserNotPopulated(id: string): Promise<IArticle | null> {
    try {
      const articleDoc = await ArticleModel.findById(id)
      
      return articleDoc ? this.mapToEntity(articleDoc) : null;
    } catch (error) {
      console.error('Error finding article by id:', error);
      return null;
    }
  }

  async findBySlug(slug: string): Promise<IArticle | null> {
    try {
      const articleDoc = await ArticleModel.findOne({ slug }).populate({
        path: 'authorId',
        select: 'name email'
      });
      
      return articleDoc ? this.mapToEntity(articleDoc) : null;
    } catch (error) {
      console.error('Error finding article by slug:', error);
      return null;
    }
  }

  async findByAuthorId(authorId: string): Promise<IArticle[]> {
    try {
      const articleDocs = await ArticleModel.find({ authorId })
        .populate({
          path: 'authorId',
          select: 'name email'
        })
        .sort({ createdAt: -1 });
      
      return articleDocs.map(doc => this.mapToEntity(doc));
    } catch (error) {
      console.error('Error finding articles by author:', error);
      return [];
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ articles: IArticle[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      
      const [articleDocs, total] = await Promise.all([
        ArticleModel.find()
          .populate({
            path: 'authorId',
            select: 'name email'
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ArticleModel.countDocuments()
      ]);
      
      
      
      const articles = articleDocs.map(doc => this.mapToEntity(doc));
      return { articles, total };
    } catch (error) {
      console.error('Error finding all articles:', error);
      return { articles: [], total: 0 };
    }
  }

  async update(id: string, article: Partial<IUpdateArticle>): Promise<IArticle | null> {
    try {
      const updateData: any = { ...article };
      
      if (article.title) {
        updateData.slug = this.generateSlug(article.title);
      }
        const existingArticle = await ArticleModel.findById(id);
        if (existingArticle) {
          updateData.publishedAt = new Date();
        }

      const updatedArticle = await ArticleModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate({
        path: 'authorId',
        select: 'name email'
      });
      
      return updatedArticle ? this.mapToEntity(updatedArticle) : null;
    } catch (error) {
      console.error('Error updating article:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await ArticleModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }

  async search(query: string, page: number = 1, limit: number = 10): Promise<{ articles: IArticle[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      
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
      
      const [articleDocs, total] = await Promise.all([
        ArticleModel.find(searchFilter)
          .populate({
            path: 'authorId',
            select: 'name email'
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ArticleModel.countDocuments(searchFilter)
      ]);
      
      const articles = articleDocs.map(doc => this.mapToEntity(doc));
      return { articles, total };
    } catch (error) {
      console.error('Error searching articles:', error);
      return { articles: [], total: 0 };
    }
  }

  private mapToEntity(articleDoc: IArticleDocument): IArticle {
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
