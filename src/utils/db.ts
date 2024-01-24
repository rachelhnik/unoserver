import mongoose from "mongoose";
import { config } from "../config/config";

const mongoUri = config.mongoUri;

const connectDb = async () => {
  console.log(">>>><<<<<");
  try {
    await mongoose.connect(mongoUri).then((data: any) => {
      console.log(`Database is connected at ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log("error", error.message);
  }
};

export default connectDb;
