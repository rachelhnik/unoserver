import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
const mongod = MongoMemoryServer.create();
export const connect = async () => {
  const uri = (await mongod).getUri();
  await mongoose.connect(uri);
};
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  (await mongod).stop();
};
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

it("should run", () => {
  expect(2 + 2).toBe(4);
});
