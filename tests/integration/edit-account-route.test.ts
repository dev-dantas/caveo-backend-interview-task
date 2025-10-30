import { afterEach, describe, it, expect } from "vitest";

import request from "supertest";

import "./utils/user-entity-mock";
import "./utils/jwt-verify-mock";

import app from "../../src/presentation/server";

import { User, UserRole } from "../../src/domain/entity/User";

describe("Integration: /edit-account route", () => {
  afterEach(() => {
    User.clear();
  });

  it("deve permitir que o admin altere nome e role", async () => {
    const admin = User.create({
      email: "admin@example.com",
      name: "Administrador",
      role: UserRole.Admin,
      isOnboarded: true,
    });

    await admin.save();

    const token = "mocked-jwt-token-admin";

    const response = await request(app.callback())
      .put("/edit-account")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Novo Nome",
        role: UserRole.User,
      })
      .expect(200);

    expect(response.body.name).toBe("Novo Nome");
    expect(response.body.role).toBe(UserRole.User);
  });

  it("deve permitir que o usuário altere apenas o próprio nome", async () => {
    const user = User.create({
      email: "user@example.com",
      name: "Antigo Nome",
      role: UserRole.User,
      isOnboarded: false,
    });

    await user.save();

    const token = "mocked-jwt-token-user";

    const response = await request(app.callback())
      .put("/edit-account")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Novo Nome" })
      .expect(200);

    expect(response.body.name).toBe("Novo Nome");
    expect(response.body.isOnboarded).toBe(true);
  });

  it("deve retornar 404 caso o usuário não tenha sido encontrado", async () => {
    const token = "mocked-jwt-token-user";

    const response = await request(app.callback())
      .put("/edit-account")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(response.body).toHaveProperty("error", "User not found");
  });

  it("deve retornar 409 se o usuário tentar alterar o role", async () => {
    const user = User.create({
      email: "user@example.com",
      name: "Usuário 1",
      role: UserRole.User,
      isOnboarded: false,
    });

    await user.save();

    const token = "mocked-jwt-token-user";

    const response = await request(app.callback())
      .put("/edit-account")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Novo Nome", role: UserRole.Admin })
      .expect(409);

    expect(response.body).toHaveProperty(
      "error",
      "Regular users can only update their name"
    );
  });
});
