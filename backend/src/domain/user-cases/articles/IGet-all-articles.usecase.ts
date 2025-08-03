import { ArticleListResponseDto, GetArticlesDto } from "../../../application/dtos/article.dto";

export interface IGetAllArticlesUseCase {
  execute(dto: GetArticlesDto): Promise<ArticleListResponseDto>;
}
