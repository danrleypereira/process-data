import fs from 'fs';
import axios from 'axios';
import { processCsvFromStream } from "../helpers/csvProcessor.js";
import { isCpfValid, isCnpjValid, validatePayments } from "../validators/index.js";
import { formatToBRL } from "../helpers/currencyConverter.js";
import { PassThrough } from 'stream';

const outputJSONStream = fs.createWriteStream("processed_data.json", { flags: "a" });
const outputCSVSream = fs.createWriteStream("processed_data.csv", { flags: "a" });

export const jobProcessor = async (job) => {
    await job.log(`Started processing job with id ${job.id}`);
    await job.updateProgress(15);

    try {
        // Fetch CSV file from the server using the file URI provided in the job data
        const response = await axios.get(job.data.fileUri, { responseType: 'stream' });

        // Create a PassThrough stream to process the axios response stream
        const csvStream = new PassThrough();
        response.data.pipe(csvStream);

        // Process the CSV stream using your custom processCsvInStream function
        const jsonData = await processCsvFromStream(csvStream, onData, onEnd, onError);

        await job.updateProgress(100);
        return { data: jsonData, websocketUrl: job.data.websocketUrl };
    } catch (error) {
        console.error(`Error processing job with id ${job.id}:`, error);
        await job.log(`Error processing job with id ${job.id}: ${error.message}`);
        throw error; // Ensure the job fails properly if there's an error
    }
};

// Define the processing functions for each row and stream end/error events
function onData(data) {
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
    const jsonData = JSON.stringify(processedData);
    outputJSONStream.write(jsonData);

    const csvLine = Object.values(processedData).join(",") + "\n";
    outputCSVSream.write(csvLine);
}

function onEnd() {
    outputJSONStream.end();
    outputCSVSream.end();
    console.log("CSV and JSON processing completed successfully!");
}

function onError(error) {
    console.error("Error processing CSV:", error);
    outputJSONStream.end();
    outputCSVSream.end();
}