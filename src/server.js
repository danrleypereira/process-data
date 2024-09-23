import express from "express";
import multer from "multer";
import { JOB_QUEUE, setUpWorker } from "./workFlow/index.js";
import {fileURLToPath, pathToFileURL} from "url";

const app = express();
const upload = multer({ dest: 'uploads/' });

// Inicia o Worker
setUpWorker();


// Rota para upload de CSV e adição à fila de processamento
app.post('/upload', upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Definindo os atributos de job
    const fileUrl = pathToFileURL(req.file.path).href;
    const userName = req.body.userName || 'defaultUser';
    const totalRows = req.body.totalRows ? parseInt(req.body.totalRows, 10) : 0;

    const outputFilePath = `processed_results_${Date.now()}.csv`;

    // Adiciona o trabalho à fila
    const job = await JOB_QUEUE.add('csv-process', {
      csvFileUrl: fileUrl,
      outputFilePath: outputFilePath,
      userName: userName,
      totalRows: totalRows,
    });

    // Aguarda o trabalho ser concluído e obtém os dados processados como JSON
    const jsonData = await job.waitUntilFinished(JOB_QUEUE.client);

    res.json({
      message: 'File uploaded and processing completed',
      jobId: job.id,
      data: jsonData, // Retorno dos dados em JSON
      outputFilePath: outputFilePath,
    });
  } catch (error) {
    console.error('Error adding job to queue:', error);
    res.status(500).send('Error processing file');
  }
});

// Função para paginar os dados
function paginate(data, page, limit) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return data.slice(startIndex, endIndex);
}


// Inicia o servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});