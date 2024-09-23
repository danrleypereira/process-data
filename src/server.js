import express from "express";
import multer from "multer";
import { processCsvToArray } from "./helpers/csvProcessor.js";
import { saveProcessedCsv } from "./helpers/csvWriter.js";

const app = express();
const upload = multer({ dest: "uploads/" });

let cachedData = null;
let lastUploadTimestamp = null;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const paginate = (array, page, limit) => {
  const start = (page - 1) * limit;
  const end = page * limit;
  return array.slice(start, end);
};

app.post("/upload", upload.single("csv"), async (req, res) => {
  try {
    console.log('oi')
    if (req.file || !cachedData) {
      const filePath = req.file ? req.file.path : null;

      if (!cachedData || lastUploadTimestamp !== req.file.filename) {
        console.log(filePath)
        const data = await processCsvToArray(filePath);
        lastUploadTimestamp = req.file.filename;

        cachedData = saveProcessedCsv(data, "processed_results.csv");
      }
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const paginatedData = paginate(cachedData, page, limit);
    const totalPages = Math.ceil(cachedData.length / limit);

    res.json({
      results: paginatedData,
      page,
      totalPages,
      totalResults: cachedData.length,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send("Error processing file");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
