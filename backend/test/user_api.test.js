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
  try {
    await api.get("/populate").expect(200);
  } catch (err) {
    mongoose.connection.close();
  }
});
describe("search user api", () => {
  describe("success with ", () => {
    let response;
    test("response status 200", async () => {
      response = await api.get("/api/users").expect(200);

      expect(response.body[0]).toHaveLength(10);
      expect(response.body[1]).toBeGreaterThan(950);
    });
    test("response body should be an array with length = 2", () => {
      expect(response.body.constructor).toBe(Array);
      expect(response.body.length).toBe(2);
    });
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
    test("when email is not provided in body with statusCode 400", async () => {
      const user = { ...helper.newUser1 };
      delete user.email;
      const response = await api.post("/api/users/").send(user).expect(400);
      const responseBodyKeys = Object.keys(response.body);
      expect(responseBodyKeys).toContain("err");
    });
    test("when user already exists with statusCode 400", async () => {
      await api.post("/api/users").send(helper.initialUsers[0]).expect(201);
      const response = await api
        .post("/api/users")
        .send(helper.initialUsers[0])
        .expect(400);
      expect(response.body.err).toBe("user already exists");
    });
    test("when gender is not equal to ('Male' or 'Female')", async () => {
      const userWithGender = { ...helper.newUser1 };
      userWithGender.gender = "Temp";
      await api.post("/api/users/").send(userWithGender).expect(400);
    });
    test("when email is invalid", async () => {
      const userWithGender = { ...helper.newUser1 };
      userWithGender.email = "abcdefghi";
      await api.post("/api/users/").send(userWithGender).expect(400);
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

describe("delete user", () => {
  let user;
  beforeAll(async () => {
    user = (await api.get("/api/users")).body;
  });
  test("should fail when user not exists with status 404", async () => {
    let invalidId = "12454212345fe";
    await api.delete(`/api/user/${invalidId}`).expect(404);
  });
  test("success with status code 200", async () => {
    await api.delete(`/api/users/${user[0][0].id}`).expect(200);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
