import { Worker } from 'bullmq';
import { CONNECTOR } from './config.js';
import { jobProcessor } from './processor.js'

export default async function setUpWorker () {
    const worker = new Worker('JOBS', jobProcessor,
        { autorun: true, connection: CONNECTOR });
    console.log("setting up worker")

    worker.on('active', (job) => {
        console.debug(`Activating job with id ${job.id}`);
        console.debug(`Job data: ${JSON.stringify(job.data)}`);
    });

    worker.on('completed', (job, result) => {
        console.debug(`Completed job with id ${job.id}`);
        console.log(result.websocketUrl);
        // TODO: avisar frontend (websocket)
    });

    worker.on('progress', (job, progress) => {
        // TODO: mandar resultado parcial pro frontend
        console.debug("progress: " + JSON.stringify(progress));
    });

    worker.on('failed', (job, error) => {
        console.error(`Job failed with id ${job.id}`);
        console.error(`Error: ${error.message}`);
    });

    worker.on('error', (failedReason) => {
        console.error(`Worker encountered an error: ${failedReason}`);
    });
};

