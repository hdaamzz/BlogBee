import { Router } from 'express';
import { container } from '../container/container';
import { AuthController } from '../../interface-adapters/controllers/auth.controller';
import { validateRequest } from '../../interface-adapters/middlewares/validation.middleware';
import { loginValidationSchema, registerValidationSchema } from '../../interface-adapters/validators/auth.validator';
import { authenticateToken } from '../../interface-adapters/middlewares/auth.middleware';

const router = Router();
const authController = container.resolve(AuthController);

router.post('/register', validateRequest(registerValidationSchema),(req, res) => authController.register(req, res));
router.post('/login', validateRequest(loginValidationSchema),(req,res)=>authController.login(req,res))
router.post('/logout', authenticateToken,(req, res) => authController.logout(req, res));
router.get('/profile', authenticateToken,(req, res) => authController.getProfile(req, res));


export default router;