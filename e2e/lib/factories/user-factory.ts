export class UserFactory {
  static createUser(overrides?: Partial<User>): User {
    return {
      username: `user_${}`,
      email: `user_${}@example.com`,
      password: 'Password123',
      // Include other user properties
      ...overrides,
    };
  }
}

interface User {
  username: string;
  email: string;
  password: string;
  // Other properties...
}
