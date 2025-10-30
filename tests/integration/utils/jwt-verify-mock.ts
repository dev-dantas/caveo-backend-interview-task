import { vi } from "vitest";

vi.mock("../../../src/lib/aws/cognito", () => {
  return {
    cognitoVerifier: {
      verify: vi.fn(async (token: string) => {
        if (!token || typeof token !== "string") {
          throw new Error("Invalid token");
        }

        if (token.includes("admin")) {
          return {
            sub: "mock-admin-sub",
            email: "admin@example.com",
            "cognito:groups": ["admin"],
          };
        }

        if (token.includes("user")) {
          return {
            sub: "mock-user-sub",
            email: "user@example.com",
            "cognito:groups": ["user"],
          };
        }

        throw new Error("Invalid or expired token");
      }),
    },
  };
});
