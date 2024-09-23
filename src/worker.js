const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const fs = require('fs');
const csv = require('csv-parser');
const {isCpfValid, isCnpjValid, validatePayments} = require("./validators/index.js");
const {formatToBRL} = require("./helpers/currencyConverter.js");

// Configuração do Redis
const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
});

// Funções de Callback para os eventos do CSV
function onData(data) {
    console.log('Received data:', data);
    const processedData = {
        ...data,
        isValidCpfOrCNPJ: isCpfValid(data.nrCpfCnpj) || isCnpjValid(data.nrCpfCnpj),
        isPaymentValid: validatePayments(data).isValid,
        vlTotalBRL: formatToBRL(data.vlTotal),
        vlPrestaBRL: formatToBRL(data.vlPresta),
        vlMoraBRL: formatToBRL(data.vlMora),
        vlMultaBRL: formatToBRL(data.vlMulta),
        vlAtualBRL: formatToBRL(data.vlAtual),
    };

    return JSON.stringify(data);

}

function onEnd() {
    console.log('Finished processing CSV file.');
}

function onError(err) {
    console.error('Error occurred during CSV processing: ', err);
}

// Worker para processar o CSV e armazenar no Redis
const worker = new Worker('csvQueue', async job => {
    const { filePath } = job.data;
    const dataKey = 'csvData';

    // Limpa a lista de dados anteriores
    await connection.del(dataKey);

    // Retorna uma Promise para garantir que o Worker espere o processamento completo
    return new Promise((resolve, reject) => {
        // Lê o arquivo CSV e converte para JSON
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async data => {
                try {
                    const jsonData = onData(data);

                    // Armazena cada linha no Redis como string JSON
                    await connection.rpush(dataKey, jsonData);
                } catch (error) {
                    reject(error)
                }

            })
            .on('end', () => {
                onEnd();
                resolve(); // Finaliza a Promise com sucesso
            })
            .on('error', err => {
                onError(err);
                reject(err); // Finaliza a Promise com erro
            });
    });
}, { connection });

// Listener para eventos de falha
worker.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed with error: ${error.message}`);
});
