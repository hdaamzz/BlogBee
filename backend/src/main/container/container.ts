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

// Register dependencies
container.register("UserRepository", { useClass: UserRepository });



//Usecases
container.registerSingleton(RegisterUserUseCase);
container.registerSingleton(LoginUserUseCase);
container.registerSingleton(LogoutUserUseCase);


//Services
container.register("AuthService", { useClass: AuthService });


//controller
container.registerSingleton(AuthController);

export { container };