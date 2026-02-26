import bcrypt from "bcrypt";
import request from "supertest";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("WebNest API integration", () => {
  const password = "TestPass123!";
  const email = `tester-${Date.now()}@webnest.local`;
  const contactEmail = `lead-${Date.now()}@webnest.local`;
  let userId = "";

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email,
        passwordHash,
        role: "ADMIN"
      }
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.lead.deleteMany({ where: { email: contactEmail } });
    if (userId) {
      await prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
    }
    await prisma.$disconnect();
  });

  const login = async () => {
    const response = await request(app).post("/api/auth/login").send({ email, password });
    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe(email);
    expect(response.headers["set-cookie"]).toBeDefined();
    return response.headers["set-cookie"] as string[];
  };

  it("authenticates with login", async () => {
    await login();
  });

  it("accepts public contact submissions", async () => {
    const response = await request(app).post("/api/public/contact").send({
      name: "Lead Example",
      email: contactEmail,
      company: "Example Co",
      phone: "555-0199",
      message: "We need a new website."
    });
    expect(response.status).toBe(201);
    expect(response.body.leadId).toBeDefined();
  });

  it("lists leads for authenticated users", async () => {
    const sessionCookie = await login();
    const response = await request(app)
      .get("/api/leads?page=1")
      .set("Cookie", sessionCookie);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.items)).toBe(true);
  });
});
