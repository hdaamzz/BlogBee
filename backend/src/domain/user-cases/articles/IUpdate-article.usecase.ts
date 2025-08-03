import { ArticleResponseDto, UpdateArticleDto } from "../../../application/dtos/article.dto";

export interface IUpdateArticleUseCase {
  execute(articleId: string, dto: UpdateArticleDto, authorId: string): Promise<ArticleResponseDto>;
}
