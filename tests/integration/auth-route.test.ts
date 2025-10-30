import { afterEach, describe, it, expect } from "vitest";

import request from "supertest";

import "./utils/user-entity-mock";

import app from "../../src/presentation/server";

import { User, UserRole } from "../../src/domain/entity/User";

describe("Integration: /auth route", () => {
  afterEach(() => {
    User.clear();
  });

  it("deve registrar um novo usuário se o e-mail não existir", async () => {
    const response = await request(app.callback())
      .post("/auth")
      .send({ email: "newuser@example.com", name: "Novo Usuário" })
      .expect(200);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User signed in");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe("newuser@example.com");
    expect(response.body.user.name).toBe("Novo Usuário");
    expect(response.body.user.role).toBe(UserRole.User);
    expect(response.body.user.isOnboarded).toBe(false);
  });

  it("deve retornar o usuário existente se o e-mail já estiver cadastrado", async () => {
    const storedUser = User.create({
      email: "existing@example.com",
      name: "Usuário Existente",
      role: UserRole.Admin,
      isOnboarded: true,
    });

    await storedUser.save();

    const response = await request(app.callback())
      .post("/auth")
      .send({ email: "existing@example.com", name: "Teste" })
      .expect(200);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User signed in");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe("existing@example.com");
    expect(response.body.user.name).toBe("Usuário Existente");
    expect(response.body.user.role).toBe(UserRole.Admin);
    expect(response.body.user.isOnboarded).toBe(true);
  });

  it("deve retornar 422 se o campo de e-mail não for enviado", async () => {
    const response = await request(app.callback())
      .post("/auth")
      .send({ name: "Usuário sem Email" })
      .expect(422);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Email is required");
  });

  it("deve retornar 422 se o campo de nome não for enviado", async () => {
    const response = await request(app.callback())
      .post("/auth")
      .send({ email: "unnamed@example.com" })
      .expect(422);

    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Name is required");
  });
});
