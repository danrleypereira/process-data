import express from "express";
import fs from "fs";
import multer from "multer";
import { JOB_QUEUE, setUpWorker } from "./workFlow/index.js";
import path from "path";

const app = express();

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route for CSV file upload and adding to job queue (immediate response without waiting for job completion)
app.post('/upload', upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct the file URI for the job to access it through the REST server
    const fileName = req.file.filename;
    const fileUrl = `http://localhost:5000/file?fileName=${fileName}`; // Update with your server URL if needed

    // Add the job to the queue
    const job = await JOB_QUEUE.add('csv-process', {
      fileUri: fileUrl, // Use the REST endpoint for file access
      websocketUrl: "ws://localhost:3001/"
    });

    // Immediately respond without waiting for the job to finish
    res.json({
      message: 'File uploaded and job created successfully',
      jobId: job.id,
      fileUri: fileUrl,  // Return the uploaded file URI for tracking
    });

  } catch (error) {
    console.error('Error adding job to queue:', error);
    res.status(500).send('Error processing file');
  }
});

// Route to return a specific file from uploads directory based on query parameter
app.get('/file', async (req, res) => {
  try {
    const fileName = req.query.fileName;

    if (!fileName) {
      return res.status(400).json({ error: 'fileName query parameter is required' });
    }

    // Use the upload destination path directly from multer configuration
    const filePath = path.join('uploads', fileName);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Stream the file content as a response
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (error) => {
        console.error('Error reading the file:', error);
        res.status(500).json({ error: 'Error reading the file' });
      });
      res.setHeader('Content-Type', 'text/csv'); // Set the appropriate content type for CSV
      fileStream.pipe(res); // Pipe the file stream to the response
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Error fetching file' });
  }
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
