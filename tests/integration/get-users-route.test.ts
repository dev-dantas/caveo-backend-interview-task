import { afterEach, describe, it, expect } from "vitest";

import request from "supertest";

import "./utils/user-entity-mock";
import "./utils/jwt-verify-mock";

import app from "../../src/presentation/server";
import { User, UserRole } from "../../src/domain/entity/User";

describe("Integration: /users route", () => {
  afterEach(() => {
    User.clear();
  });

  it("deve retornar todos os usuários quando o admin estiver autenticado", async () => {
    const admin = User.create({
      email: "admin@example.com",
      name: "Administrador",
      role: UserRole.Admin,
      isOnboarded: true,
    });

    await admin.save();

    const user1 = User.create({
      email: "user1@example.com",
      name: "Usuário 1",
      role: UserRole.User,
      isOnboarded: true,
    });

    const user2 = User.create({
      email: "user2@example.com",
      name: "Usuário 2",
      role: UserRole.User,
      isOnboarded: false,
    });

    await user1.save();
    await user2.save();

    const token = "mocked-jwt-token-admin";

    const response = await request(app.callback())
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
    expect(response.body.some((u) => u.email === "admin@example.com")).toBe(
      true
    );
    expect(response.body.some((u) => u.email === "user1@example.com")).toBe(
      true
    );
    expect(response.body.some((u) => u.email === "user2@example.com")).toBe(
      true
    );
  });

  it("deve retornar 401 se um usuário comum tentar acessar /users", async () => {
    const user = User.create({
      email: "user@example.com",
      name: "Usuário Comum",
      role: UserRole.User,
      isOnboarded: true,
    });

    await user.save();

    const token = "mocked-jwt-token-user";

    const response = await request(app.callback())
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);

    expect(response.body).toHaveProperty(
      "error",
      "Access denied: insufficient permissions"
    );
  });

  it("deve retornar 401 se o token não for enviado", async () => {
    const response = await request(app.callback()).get("/users").expect(401);

    expect(response.body).toHaveProperty(
      "error",
      "Missing Authorization header"
    );
  });
});
