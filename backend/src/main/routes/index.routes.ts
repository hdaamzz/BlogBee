import express from 'express';
import authRouter from './auth.routes';
import articleRouter from "./article.routes"

const router = express.Router();



router.use('/auth', authRouter);
router.use('/articles', articleRouter);



export default router;