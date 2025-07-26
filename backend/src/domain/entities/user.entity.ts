import { Email } from '../value-objects/email.vo';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: Email,
    public readonly password: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(name: string, email: string, hashedPassword: string): User {
    return new User(
      '',
      name,
      new Email(email),
      hashedPassword
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}