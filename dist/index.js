"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
// import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const research_routes_1 = __importDefault(require("./routes/research.routes"));
const tags_routes_1 = __importDefault(require("./routes/tags.routes"));
const likes_routes_1 = __importDefault(require("./routes/likes.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Enable CORS
app.enable("trust proxy");
// allowed cors *
const corsConfig = {
    origin: true,
    credentials: true,
};
app.use((0, cors_1.default)(corsConfig));
app.options("*", (0, cors_1.default)(corsConfig));
// cookie
app.use((0, cookie_parser_1.default)());
// get request json
app.use(express_1.default.json());
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
// PUBLIC PATH
app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/research", research_routes_1.default);
app.use("/api/tags", tags_routes_1.default);
app.use("/api/likes", likes_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map