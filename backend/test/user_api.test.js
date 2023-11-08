const mongoose = require("mongoose");
const supertest = require("supertest");
require("dotenv").config();
const app = require("../app");
const User = require("../model/user");
const team = require("../model/team");
const helper = require("./helper");

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});
  await team.deleteMany({});

  await User.insertMany(helper.initialUsers);
});

describe("Get user data and their count", () => {
  test("number of user in database should be 3", async () => {
    const users = (await api.get("/api/users").expect(200)).body;
    expect(users[1]).toBe(3);
  });
  test("number of user get in respose should be 3", async () => {
    const users = (await api.get("/api/users").expect(200)).body;
    expect(users[0]).toHaveLength(3);
  });
});
describe("create user api", () => {
  describe("should fail", () => {
    test("when first_name is not provided in body with statusCode 400", async () => {
      const user = { ...helper.newUser1 };
      delete user.first_name;
      const response = await api.post("/api/users/").send(user).expect(400);
      const responseBodyKeys = Object.keys(response.body);
      expect(responseBodyKeys).toContain("err");
    });
    test("when last_name is not provided in body with statusCode 400", async () => {
      const user = { ...helper.newUser1 };
      delete user.last_name;
      const response = await api.post("/api/users/").send(user).expect(400);
      const responseBodyKeys = Object.keys(response.body);
      expect(responseBodyKeys).toContain("err");
    });
    test("when email is not provided in body with statusCode 4000", async () => {
      const user = { ...helper.newUser1 };
      delete user.email;
      const response = await api.post("/api/users/").send(user).expect(400);
      const responseBodyKeys = Object.keys(response.body);
      expect(responseBodyKeys).toContain("err");
    });
    test("when user already exists with statusCode 400", async () => {
      const response = await api
        .post("/api/users")
        .send(helper.initialUsers[0])
        .expect(400);
      expect(response.body.err).toBe("user already exists");
    });
  });
  test("should success and with statusCode 201", async () => {
    const response = await api
      .post("/api/users")
      .send(helper.newUser1)
      .expect(201);
    const resposeBodyKeys = Object.keys(response.body);
    expect(resposeBodyKeys).not.toContain("err");
  });
});

afterAll(() => {
  mongoose.connection.close();
});
