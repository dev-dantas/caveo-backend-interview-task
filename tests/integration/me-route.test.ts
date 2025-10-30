import { afterEach, describe, it, expect } from "vitest";

import request from "supertest";

import "./utils/user-entity-mock";
import "./utils/jwt-verify-mock";

import app from "../../src/presentation/server";

import { User, UserRole } from "../../src/domain/entity/User";

describe("Integration: /me route", () => {
  afterEach(() => {
    User.clear();
  });

  it("deve retornar as informações do usuário autenticado", async () => {
    const user = User.create({
      email: "user@example.com",
      name: "Usuário Atual",
      role: UserRole.User,
      isOnboarded: true,
    });

    await user.save();

    const token = "mocked-jwt-token-user";

    const response = await request(app.callback())
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty("email", "user@example.com");
    expect(response.body).toHaveProperty("name", "Usuário Atual");
    expect(response.body).toHaveProperty("role", UserRole.User);
    expect(response.body).toHaveProperty("isOnboarded", true);
  });

  it("deve retornar 401 se o token JWT não for enviado", async () => {
    const response = await request(app.callback()).get("/me").expect(401);

    expect(response.body).toHaveProperty(
      "error",
      "Missing Authorization header"
    );
  });

  it("deve retornar 404 se o usuário não for encontrado", async () => {
    const token = "mocked-jwt-token-user";

    const response = await request(app.callback())
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(response.body).toHaveProperty("error", "User not found");
  });
});
