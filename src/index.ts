import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
require("dotenv").config();
// import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import researchRoutes from "./routes/research.routes";
import tagsRoutes from "./routes/tags.routes";
import likesRoutes from "./routes/likes.routes";
import iMulter from "./utils/multer.util";
import { addWatermark } from "./utils/helper.util";
import axios from 'axios';

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
app.use("/api/tags", tagsRoutes);
app.use("/api/likes", likesRoutes);

app.get('/api/watermark', async (req: Request, res: Response) => {
  try {
    const text = req.query.text || '';
    const pdf_url = req.query.pdf_url || '';

    if (pdf_url !== '' && text !== '') {
      const response = await axios.get(pdf_url.toString(), { responseType: 'arraybuffer' });
      const pdfBuffer = Buffer.from(response.data);
      const modifiedPdfBytes = await addWatermark(pdfBuffer, text.toString());

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="modified.pdf"');
      const buffer = Buffer.from(modifiedPdfBytes);
      res.send(buffer);
    } else {
      res.status(404).send('PDF URL is not provided');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding watermark');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
