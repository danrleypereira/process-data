import pkg, {startsWith} from 'yarn/lib/cli.js';
const { stringify } = pkg;

import fs from 'fs';
import parse from "csv-parser";
import { promisify } from 'util';
import { fileURLToPath, pathToFileURL } from 'url';

import { CONNECTOR as redisClient } from './config.js';
import { isCpfValid, isCnpjValid, validatePayments } from "../validators/index.js";
import { formatToBRL } from "../helpers/currencyConverter.js";

const sleep = promisify(setTimeout);

const fileName = 'employment_indicators.json';

// Remove o arquivo existente para um novo processamento
if (fs.existsSync(fileName)) {
    fs.unlinkSync(fileName);
}

export const jobProcessor = async (job) => {
    await job.log(`Started processing job with id ${job.id}`);

    // Processa o CSV
    const jsonData = await processCSVStream(job.data);

    await job.updateProgress(100);
    return jsonData;
};


const processCSVStream = async (jobData) => {
    try {
        let processedCount = 0;
        let processedDataArray = []; // Para armazenar os dados processados

        // Criar stream de escrita para o CSV de saída
        const outputStream = fs.createWriteStream(jobData.outputFilePath);
        const csvStringify = stringify({ header: true }); // Adiciona cabeçalho ao CSV

        // Pipe de stringificação para o arquivo de saída
        csvStringify.pipe(outputStream);

        // Cria stream de leitura do CSV de entrada e processa linha a linha
        const stream = fs.createReadStream(jobData.csvFileUrl)
            .pipe(
                parse({
                    columns: true, // Interpreta cada linha como um objeto com base no cabeçalho do CSV
                })
            )
            .on('data', async (data) => {
                // Simulação de processamento complexo
                await sleep(10);

                // Processa cada linha do CSV
                const processedData = processCSVRow(data);

                // Armazena a linha processada no Redis e no array
                await redisClient.rpush(`job:${jobData.jobId}:data`, JSON.stringify(processedData));
                processedDataArray.push(processedData);

                // Escreve a linha processada no CSV de saída
                csvStringify.write(processedData);

                processedCount++;
                if (processedCount % 100 === 0) {
                    await redisClient.set(`job:${jobData.jobId}:progress`, (processedCount / jobData.totalRows) * 100);
                }
            })
            .on('error', (error) => {
                console.error('Erro ao processar o CSV em streaming: ', error);
            })
            .on('end', () => {
                console.log('Processamento do CSV com streaming completo.');
                csvStringify.end(); // Finaliza o stringifier do CSV de saída
            });

        // Aguarda o término do stream
        await new Promise((resolve) => stream.on('end', resolve));

        // Cacheia o total de linhas processadas
        await redisClient.set(`job:${jobData.jobId}:processedCount`, processedCount);
        console.log(`Processamento de ${processedCount} linhas CSV finalizado.`);

        // Retorna os dados processados como JSON
        return processedDataArray;
    } catch (error) {
        console.error('Erro durante o processamento em streaming: ', error);
    }
};

const processCSVRow = (data) => {
    const isValidCpfOrCNPJ = isCpfValid(data.nrCpfCnpj) || isCnpjValid(data.nrCpfCnpj);
    const isPaymentValid = validatePayments(data).isValid;

    return {
        ...data,
        isValidCpfOrCNPJ,
        isPaymentValid,
        vlTotalBRL: formatToBRL(data.vlTotal),
        vlPrestaBRL: formatToBRL(data.vlPresta),
        vlMoraBRL: formatToBRL(data.vlMora),
        vlMultaBRL: formatToBRL(data.vlMulta),
        vlAtualBRL: formatToBRL(data.vlAtual),
    };
};