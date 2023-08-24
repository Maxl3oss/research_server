import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
require("dotenv").config();
// import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import researchRoutes from "./routes/research.routes";

const app = express();
const PORT = process.env.PORT || 3001;
// Enable CORS
app.enable("trust proxy");
// allowed cors *
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
// cookie
app.use(cookieParser());
// get request json
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// PUBLIC PATH
app.get("/", (req, res) => res.send("Express + TypeScript Server"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/research", researchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
