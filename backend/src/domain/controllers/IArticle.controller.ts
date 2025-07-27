import { Request, Response } from 'express';

export interface IArticleController {
  createArticle(req: Request, res: Response): Promise<void>;
  getUserArticles(req: Request, res: Response): Promise<void>;
  updateArticle(req: Request, res: Response): Promise<void>;
  deleteArticle(req: Request, res: Response): Promise<void>;
  getArticle(req: Request, res: Response): Promise<void>;
  getAllArticles(req: Request, res: Response): Promise<void>;
  searchArticles(req: Request, res: Response): Promise<void>;
}
