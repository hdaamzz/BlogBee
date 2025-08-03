import { ArticleListResponseDto, SearchArticlesDto } from "../../../application/dtos/article.dto";

export interface ISearchArticlesUseCase {
  execute(dto: SearchArticlesDto): Promise<ArticleListResponseDto>;
}
