import { UserArticleResponseDto } from "../../../application/dtos/article.dto";

export interface IGetUserArticlesUseCase {
  execute(authorId: string): Promise<UserArticleResponseDto[]>;
}
