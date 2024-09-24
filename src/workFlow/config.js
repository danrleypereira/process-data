import { Queue } from 'bullmq';
import Redis  from 'ioredis';

// TODO: create .env
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

// TODO: create a enum with queue name and other constant strings
