const mongoose = require("mongoose");
const supertest = require("supertest");
require("dotenv").config();
const app = require("../app");
const Team = require("../model/team");

const api = supertest(app);

beforeAll(async () => {
  await api.get("/populate");
}, 10000);
let teamToDelete; // will get define in create team success test
describe("create team api", () => {
  let user1, user2, user3;
  beforeAll(async () => {
    user1 = (await api.get("/api/users?domain=sales")).body[0][0].id;
    user2 = (await api.get("/api/users?domain=it")).body[0][0].id;
    user3 = (await api.get("/api/users?domain=management")).body[0][0].id;
  });
  test("fail: should response status 200 when all user are of different domain", async () => {
    const responseBody = (
      await api
        .post("/api/team")
        .send({ members: [user1, user2, user3] })
        .expect(400)
    ).body;
    const responseBodyKeys = Object.keys(responseBody);
    expect(responseBodyKeys).toContain("err");
  });
  test("success: should response status 200 when all user are of different domain", async () => {
    const response = await api
      .post("/api/team")
      .send({ title: "team1", members: [user1, user2, user3] });

    expect(response.status).toBe(201);
    teamToDelete = response.body; // preserving this team for delete, getSpecificTeam tests
    const responseBodyKeys = Object.keys(response.body);
    expect(responseBodyKeys).not.toContain("err");
  });
});
describe("get specific team api", () => {
  test("fail: with statusCode 400 when no such team exists", async () => {
    const invalidTeamId = "123452jfkgjw";
    const response = await api.get(`/api/team/${invalidTeamId}`);
    const responseBodyKeys = Object.keys(response.body);
    expect(response.status).toBe(400);
    expect(responseBodyKeys).toContain("err");
    expect(response.body.err).toBe("Error: no such team exists");
  });
  test("success: with statusCode 200", async () => {
    // creating a team
    const user1 = (await api.get("/api/users?domain=sales")).body[0][0].id;
    const user2 = (await api.get("/api/users?domain=it")).body[0][0].id;
    const user3 = (await api.get("/api/users?domain=management")).body[0][0].id;
    const teamCreateResponse = await api
      .post("/api/team/")
      .send({ title: "tempTeam", members: [user1, user2, user3] });
    const team = teamCreateResponse.body;
    // testing
    const response = await api.get(`/api/team/${team.id}`).expect(200);
    const responseBodyKeys = Object.keys(response.body);

    expect(responseBodyKeys).not.toContain("err");
  });
});
describe("delete team api", () => {
  test("fail: with status 400 when team id is invalid", async () => {
    const invalidId = "1234521fdgre";
    const response = await api.delete(`/api/team/${invalidId}`);
    const responseBodyKeys = Object.keys(response.body);
    expect(response.status).toBe(400);
    expect(responseBodyKeys).toContain("err");
    expect(response.body.err).toBe("Error: no such team exists");
  });
  test("success: with status code 200", async () => {
    // teamToDelete declare at starting of tests & defined in create user successful test
    const response = await api.delete(`/api/team/${teamToDelete.id}`);
    expect(response.status).toBe(200);
  });
});
describe("get all teams api", () => {
  test("success: when team database isn't empty", async () => {
    const response = await api.get("/api/team");
    expect(response.status).toBe(200);
  });
  test("fail : when team Database is empty", async () => {
    await Team.deleteMany({});
    const response = await api.get("/api/team");
    expect(response.status).toBe(400);
    expect(response.body.err).toBe("No team exists");
  });
});
describe("delete all teams api", () => {
  test("success: while deleting all team", async () => {
    await api.delete("/api/team").expect(204);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
