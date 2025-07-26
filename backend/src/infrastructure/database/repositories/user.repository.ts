import { injectable } from 'tsyringe';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import UserModel, { IUserDocument } from '../models/user.model';

@injectable()
export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email.value,
      password: user.password
    });

    const savedUser = await userDoc.save();
    return this.mapToEntity(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const userDoc = await UserModel.findByIdAndUpdate(id, userData, { new: true });
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  private mapToEntity(userDoc: IUserDocument): User {
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