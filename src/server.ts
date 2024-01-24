import app from "./app";
import dotenv from "dotenv";
import connectDb from "./utils/db";

dotenv.config();

const port = process.env.PORT;
console.log("port");

app.listen(8080, () => {
  console.log(`[server]: Server is running at http://localhost:${8080}`);
  connectDb();
});
