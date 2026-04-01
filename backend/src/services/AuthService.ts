import bcryptjs from 'bcryptjs';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }

  // Compare password with hash
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  // Create user
  static async createUser(name: string, email: string, password: string) {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        password_hash: passwordHash,
        name,
      })
      .returning();

    if (!newUser[0]) {
      throw new Error('Failed to create user');
    }

    return {
      id: newUser[0].id,
      email: newUser[0].email,
      name: newUser[0].name,
    };
  }

  // Get user by email
  static async getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Authenticate user
  static async authenticateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);

    // Check password
    const passwordMatch = await this.comparePassword(password, user.password_hash);

    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
