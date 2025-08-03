import { ArticleResponseDto, CreateArticleDto } from "../../../application/dtos/article.dto";

export interface ICreateArticleUseCase {
  execute(dto: CreateArticleDto, authorId: string): Promise<ArticleResponseDto>;
}
