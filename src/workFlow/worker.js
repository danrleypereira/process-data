import { Worker } from 'bullmq';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { CONNECTOR } from './config.js';
import { jobProcessor } from './processor.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processorPath = path.resolve(__dirname, 'processor.js');
console.log('processorFilePath:', jobProcessor);

export default function setUpWorker () {
    const worker = new Worker('JOBS', jobProcessor, {
        connection: CONNECTOR,
        autorun: true,
    });

    worker.on('active', (job) => {
        console.debug(`Processing job with id ${job.id}`);
        console.debug(`Job data: ${JSON.stringify(job.data)}`);
    });

    worker.on('completed', (job, returnValue) => {
        console.debug(`Completed job with id ${job.id}`);
        console.debug(`Return value: ${JSON.stringify(returnValue)}`);
    });

    worker.on('failed', (job, error) => {
        console.error(`Job failed with id ${job.id}`);
        console.error(`Error: ${error.message}`);
    });

    worker.on('error', (failedReason) => {
        console.error(`Worker encountered an error: ${failedReason}`);
    });
};

