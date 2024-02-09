"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const helper_util_1 = require("./utils/helper.util");
const axios_1 = __importDefault(require("axios"));
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
app.get('/api/watermark', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const text = req.query.text || '';
        const pdf_url = req.query.pdf_url || '';
        if (pdf_url !== '' && text !== '') {
            const response = yield axios_1.default.get(pdf_url.toString(), { responseType: 'arraybuffer' });
            const pdfBuffer = Buffer.from(response.data);
            const modifiedPdfBytes = yield (0, helper_util_1.addWatermark)(pdfBuffer, text.toString());
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="modified.pdf"');
            const buffer = Buffer.from(modifiedPdfBytes);
            res.send(buffer);
        }
        else {
            res.status(404).send('PDF URL is not provided');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error adding watermark');
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map