import request from "supertest";
const { MongoClient } = require("mongodb");
import app from "../../app";
import * as db from "../db";

import {
  addUser,
  editUserData,
  findUserByEmail,
  generateUserId,
} from "../../services/userService";
import User from "../../models/userModel";

describe("User authentication", () => {
  beforeAll(async () => {
    await db.connect();
  });
  afterEach(async () => {
    await db.clearDatabase();
  });
  afterAll(async () => {
    await db.closeDatabase();
  });

  describe("User service checking", () => {
    it("should return a userid with length 8", () => {
      const id = generateUserId("hello");
      expect(id).toHaveLength(8);
    });
    it("should return a user if email exist", async () => {
      await User.create({
        email: "mgmg@gmail.com",
        name: "mgmg",
        userId: "mg123456",
        avatar: "",
      });

      const user = await findUserByEmail("mgmg@gmail.com");
      expect(user).toBeDefined();
      expect(user).not.toBeNull();
    });
    it("should return null if email doesn't exist", async () => {
      const user = await findUserByEmail("mgmg@gmail.com");
      expect(user).toBeNull();
    });
    it("should add new user", async () => {
      let id = generateUserId("hello");
      expect(id).toHaveLength(8);
      const existingUser = await User.findOne({ userId: id });

      expect(existingUser).toBeNull();
      const newUser = await User.create({
        email: "tst@gmail.com",
        name: "tst",
        userId: id,
        avatar: "",
      });
      expect(newUser._id).toBeDefined();
      expect(newUser.userId).toEqual(id);

      const user = await addUser("tst", "tst2@gmail.com", "");
      expect(user).toBeDefined();

      const users = await User.find();
      expect(users).toHaveLength(2);
    });

    it("should update a user", async () => {
      // Create a new user
      await User.create({
        email: "mgmg@gmail.com",
        name: "mgmg",
        userId: "mg123456",
        avatar: "",
      });

      let user = await findUserByEmail("mgmg@gmail.com");
      expect(user).toBeDefined();

      if (user) {
        if (user.name !== "meemee") {
          await User.findByIdAndUpdate(user._id, {
            name: "meemee",
          });
        }

        if (user.userId !== "mg222222") {
          const existingUser = await User.findOne({ userId: "mg222222" });
          expect(existingUser).toBeNull();
          if (!existingUser) {
            // Update the userId
            await User.findByIdAndUpdate(user._id, {
              userId: "mg222222",
            });
          }
        }
      }
      const userUpdated = await User.findOne({ email: "mgmg@gmail.com" });
      expect(userUpdated?.name).toBe("meemee");
      expect(userUpdated?.userId).toBe("mg222222");
      const test = await editUserData("kk", "mgmg@gmail.com", "", "mg333333");
      expect(test).toBeDefined();
      expect(test?.name).toBe("kk");
      expect(test?.userId).toBe("mg333333");
    });
  });
  describe("Request calls checking", () => {
    it("should return a user", async () => {
      const data = { email: "tst@gmail.com", name: "tst", avatar: "" };
      const response = await request(app).post("/api/v1/users").send(data);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("user");
      const user = response.body.user;
      expect(user).toBeDefined();
      expect(user._id).toBeTruthy();
      expect(user.name).toBe(data.name);
      expect(user.email).toBe(data.email);
      expect(user.userId).toHaveLength(8);
    });
    it("should throw an error", async () => {
      const data = { email: "tst@gmail.com", name: "", avatar: "" };
      const response = await request(app).post("/api/v1/users").send(data);
      expect(response.statusCode).toBe(400);
    });
    it("should update a user", async () => {
      await User.create({
        email: "mgmg@gmail.com",
        name: "mgmg",
        userId: "mg123456",
        avatar: "",
      });
      const response = await request(app)
        .put("/api/v1/users")
        .send({ name: "mkmk", email: "mgmg@gmail.com", userId: "mg123478" });
      expect(response.statusCode).toBe(201);
      const updatedUser = response.body;
      expect(updatedUser._id).toBeTruthy();
      expect(updatedUser.name).toEqual("mkmk");
      expect(updatedUser.userId).toEqual("mg123478");
    });
    it("should throw an error", async () => {
      await User.create(
        {
          email: "mgmg@gmail.com",
          name: "mgmg",
          userId: "mg123456",
          avatar: "",
        },
        {
          email: "bob@gmail.com",
          name: "bob",
          userId: "bo123456",
          avatar: "",
        }
      );
      const response = await request(app)
        .put("/api/v1/users")
        .send({ name: "mkmk", email: "mgmg@gmail.com", userId: "bo123456" });
      expect(response.statusCode).toBe(400);
    });
  });
});
