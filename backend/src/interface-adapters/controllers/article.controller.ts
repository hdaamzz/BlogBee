import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ResponseUtil } from '../../shared/utils/response.util';
import { StatusCode } from '../../shared/constants/status-codes.enum';
import { ResponseMessage } from '../../shared/constants/messages.enum';


import { CreateArticleUseCase } from '../../application/use-cases/articles/create-article.usecase';
import { GetUserArticlesUseCase } from '../../application/use-cases/articles/get-user-articles.usecase';
import { UpdateArticleUseCase } from '../../application/use-cases/articles/update-article.usecase';
import { DeleteArticleUseCase } from '../../application/use-cases/articles/delete-article.usecase';
import { GetArticleUseCase } from '../../application/use-cases/articles/get-article.usecase';
import { GetAllArticlesUseCase } from '../../application/use-cases/articles/get-all-articles.usecase';
import { SearchArticlesUseCase } from '../../application/use-cases/articles/search-articles.usecase';
import { CreateArticleDto, GetArticlesDto, SearchArticlesDto, UpdateArticleDto } from '../../application/dtos/article.dto';

@injectable()
export class ArticleController {
  constructor(
    @inject(CreateArticleUseCase) private createArticleUseCase: CreateArticleUseCase,
    @inject(GetUserArticlesUseCase) private getUserArticlesUseCase: GetUserArticlesUseCase,
    @inject(UpdateArticleUseCase) private updateArticleUseCase: UpdateArticleUseCase,
    @inject(DeleteArticleUseCase) private deleteArticleUseCase: DeleteArticleUseCase,
    @inject(GetArticleUseCase) private getArticleUseCase: GetArticleUseCase,
    @inject(GetAllArticlesUseCase) private getAllArticlesUseCase: GetAllArticlesUseCase,
    @inject(SearchArticlesUseCase) private searchArticlesUseCase: SearchArticlesUseCase
  ) {}

  async createArticle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ResponseUtil.error(res, ResponseMessage.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
        return;
      }

      const dto: CreateArticleDto = {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        tags: req.body.tags
      };

      const result = await this.createArticleUseCase.execute(dto, userId);
      
      ResponseUtil.success(
        res,
        result,
        'Article created successfully',
        StatusCode.CREATED
      );
    } catch (error: any) {
      console.error('Create article error:', error);
      ResponseUtil.error(
        res,
        error.message || 'Failed to create article',
        StatusCode.BAD_REQUEST
      );
    }
  }

  async getUserArticles(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;      
      if (!userId) {
        ResponseUtil.error(res, ResponseMessage.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
        return;
      }

      const result = await this.getUserArticlesUseCase.execute(userId);
      
      ResponseUtil.success(
        res,
        result,
        'Articles retrieved successfully'
      );
    } catch (error: any) {
      console.error('Get user articles error:', error);
      ResponseUtil.error(
        res,
        error.message || 'Failed to retrieve articles',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateArticle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ResponseUtil.error(res, ResponseMessage.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
        return;
      }

      const { id } = req.params;
      const dto: UpdateArticleDto = {
        title: req.body.title,
        excerpt: req.body.excerpt,
        content: req.body.content,
        tags: req.body.tags
      };

      const result = await this.updateArticleUseCase.execute(id, dto, userId);
      
      ResponseUtil.success(
        res,
        result,
        'Article updated successfully'
      );
    } catch (error: any) {
      console.error('Update article error:', error);
      const statusCode = error.message.includes('not found') ? StatusCode.NOT_FOUND :
                        error.message.includes('Unauthorized') ? StatusCode.FORBIDDEN :
                        StatusCode.BAD_REQUEST;
      
      ResponseUtil.error(res, error.message || 'Failed to update article', statusCode);
    }
  }

  async deleteArticle(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        ResponseUtil.error(res, ResponseMessage.UNAUTHORIZED, StatusCode.UNAUTHORIZED);
        return;
      }

      const { id } = req.params;
      await this.deleteArticleUseCase.execute(id, userId);
      
      ResponseUtil.success(
        res,
        null,
        'Article deleted successfully'
      );
    } catch (error: any) {
      console.error('Delete article error:', error);
      const statusCode = error.message.includes('not found') ? StatusCode.NOT_FOUND :
                        error.message.includes('Unauthorized') ? StatusCode.FORBIDDEN :
                        StatusCode.INTERNAL_SERVER_ERROR;
      
      ResponseUtil.error(res, error.message || 'Failed to delete article', statusCode);
    }
  }

  async getArticle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const incrementView = req.query.view === 'true';
      
      const article = await this.getArticleUseCase.execute(id, incrementView);
      
      ResponseUtil.success(
        res,
        article,
        'Article retrieved successfully'
      );
    } catch (error: any) {
      console.error('Get article error:', error);
      const statusCode = error.message.includes('not found') ? StatusCode.NOT_FOUND : StatusCode.INTERNAL_SERVER_ERROR;
      
      ResponseUtil.error(res, error.message || 'Failed to retrieve article', statusCode);
    }
  }

  async getAllArticles(req: Request, res: Response): Promise<void> {
    try {
      const dto: GetArticlesDto = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };
      
      const result = await this.getAllArticlesUseCase.execute(dto);
      
      ResponseUtil.success(
        res,
        result,
        'Articles retrieved successfully'
      );
    } catch (error: any) {
      console.error('Get all articles error:', error);
      ResponseUtil.error(
        res,
        error.message || 'Failed to retrieve articles',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchArticles(req: Request, res: Response): Promise<void> {
    try {
      const dto: SearchArticlesDto = {
        query: req.query.q as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };
      
      if (!dto.query) {
        ResponseUtil.error(res, 'Search query is required', StatusCode.BAD_REQUEST);
        return;
      }

      const result = await this.searchArticlesUseCase.execute(dto);
      
      ResponseUtil.success(
        res,
        result,
        'Search completed successfully'
      );
    } catch (error: any) {
      console.error('Search articles error:', error);
      ResponseUtil.error(
        res,
        error.message || 'Search failed',
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
