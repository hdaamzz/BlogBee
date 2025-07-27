import { injectable } from 'tsyringe';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import UserModel, { IUserDocument } from '../models/user.model';
import { BaseRepository } from './base.repository';

@injectable()
export class UserRepository extends BaseRepository<IUserDocument, User> implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async create(user: User): Promise<User> {
    const userDoc = await this.createDocument({
      name: user.name,
      email: user.email.value,
      password: user.password
    });

    return this.mapToEntity(userDoc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.findOneByFilter({ 
      email: email.toLowerCase() 
    });
    
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.findOneById(id);
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const updateData: any = { ...userData };
    if (userData.email) {
      updateData.email = userData.email.value;
    }

    const userDoc = await this.updateById(id, updateData);
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    return await this.deleteById(id);
  }

  protected mapToEntity(userDoc: IUserDocument): User {
    return new User(
      userDoc._id.toString(),
      userDoc.name,
      new Email(userDoc.email),
      userDoc.password,
      userDoc.createdAt,
      userDoc.updatedAt
    );
  }
}
