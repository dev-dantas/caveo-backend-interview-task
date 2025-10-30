import { vi } from "vitest";

enum UserRoleMock {
  Admin = "admin",
  User = "user",
}

vi.mock("../../../src/domain/entity/User", () => {
  class MockUser {
    static users: MockUser[] = [];

    id: number;
    name: string;
    email: string;
    role: UserRoleMock;
    isOnboarded: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;

    static async findOne({ where: { email } }) {
      return this.users.find((u) => u.email === email) || null;
    }

    static async find() {
      return this.users;
    }

    static create(data) {
      return new MockUser(data);
    }

    static clear() {
      this.users = [];
    }

    constructor({
      email,
      name,
      role = UserRoleMock.User,
      isOnboarded = false,
    }) {
      this.email = email;
      this.name = name;
      this.role = role;
      this.isOnboarded = isOnboarded;
    }

    async save() {
      const existing = MockUser.users.find((u) => u.email === this.email);

      if (!existing) MockUser.users.push(this);

      return this;
    }
  }

  return { User: MockUser, UserRole: UserRoleMock };
});
