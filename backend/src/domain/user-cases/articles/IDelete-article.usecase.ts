export interface IDeleteArticleUseCase {
  execute(articleId: string, authorId: string): Promise<void>;
}
