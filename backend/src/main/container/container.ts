import 'reflect-metadata';
import { container } from 'tsyringe';

// Repositories
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';

// Use Cases
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.usecase';
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user.usecase';


// Services
import { AuthService } from '../../application/services/auth/auth.service';

// Controllers
import { AuthController } from '../../interface-adapters/controllers/auth.controller';
import { LogoutUserUseCase } from '../../application/use-cases/auth/logout-user.usecase';
import { CreateArticleUseCase } from '../../application/use-cases/articles/create-article.usecase';
import { GetUserArticlesUseCase } from '../../application/use-cases/articles/get-user-articles.usecase';
import { UpdateArticleUseCase } from '../../application/use-cases/articles/update-article.usecase';
import { DeleteArticleUseCase } from '../../application/use-cases/articles/delete-article.usecase';
import { GetArticleUseCase } from '../../application/use-cases/articles/get-article.usecase';
import { GetAllArticlesUseCase } from '../../application/use-cases/articles/get-all-articles.usecase';
import { SearchArticlesUseCase } from '../../application/use-cases/articles/search-articles.usecase';
import { ArticleController } from '../../interface-adapters/controllers/article.controller';
import { ArticleRepository } from '../../infrastructure/database/repositories/article.repository';

// Register dependencies
container.register("UserRepository", { useClass: UserRepository });
container.register("ArticleRepository", { useClass: ArticleRepository });



// Register Auth use cases
container.registerSingleton(RegisterUserUseCase);
container.registerSingleton(LoginUserUseCase);
container.registerSingleton(LogoutUserUseCase);


// Register Article use cases
container.registerSingleton(CreateArticleUseCase);
container.registerSingleton(GetUserArticlesUseCase);
container.registerSingleton(UpdateArticleUseCase);
container.registerSingleton(DeleteArticleUseCase);
container.registerSingleton(GetArticleUseCase);
container.registerSingleton(GetAllArticlesUseCase);
container.registerSingleton(SearchArticlesUseCase);

//Services
container.register("AuthService", { useClass: AuthService });


//controller
container.registerSingleton(AuthController);
container.registerSingleton(ArticleController);


export { container };