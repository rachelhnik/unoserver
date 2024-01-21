"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("express-async-errors");
const db_1 = __importDefault(require("./utils/db"));
const user_route_1 = require("./routes/user.route");
const config_1 = require("./config/config");
const ErrorHandler_1 = __importDefault(require("./middlewares/ErrorHandler"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cors_1.default)({
    origin: config_1.config.origin,
    credentials: true,
}));
app.use("/api/v1/users", user_route_1.userRouter);
app.use(ErrorHandler_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
    (0, db_1.default)();
});
