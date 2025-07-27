import express from 'express';
import { container } from 'tsyringe';
import { ArticleController } from '../../interface-adapters/controllers/article.controller';
import { authenticateToken, optionalAuth } from '../../interface-adapters/middlewares/auth.middleware';
import { validateRequest } from '../../interface-adapters/middlewares/validation.middleware';
import { createArticleSchema, updateArticleSchema } from '../../interface-adapters/validators/article.validator';

const router = express.Router();
const articleController = container.resolve(ArticleController);

router.get('/', (req, res) => articleController.getAllArticles(req, res));
router.get('/search', (req, res) => articleController.searchArticles(req, res));

router.get('/user', authenticateToken, (req, res) => articleController.getUserArticles(req, res));

router.get('/:slug', optionalAuth, (req, res) => articleController.getArticle(req, res));

router.post('/', authenticateToken, validateRequest(createArticleSchema), (req, res) => articleController.createArticle(req, res));
router.put('/:id', authenticateToken, validateRequest(updateArticleSchema), (req, res) => articleController.updateArticle(req, res));
router.delete('/:id', authenticateToken, (req, res) => articleController.deleteArticle(req, res));

export default router;
