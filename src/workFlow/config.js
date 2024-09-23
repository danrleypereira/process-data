import { Queue } from 'bullmq';
import Redis  from 'ioredis';

// Configuração do Redis
export const CONNECTOR = new Redis({
    host: 'localhost', // Redis host
    port: 6379,        // Redis port
    maxRetriesPerRequest: null
});

// Criação da Fila 'JOBS'
export const JOB_QUEUE = new Queue('JOBS', {
    connection: CONNECTOR,
});
