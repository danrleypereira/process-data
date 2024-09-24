import {
  processCsvInStream,
  processCsvToArray,
} from "./helpers/csvProcessor.js";
import { saveProcessedCsv } from "./helpers/csvWriter.js";
import fs from "fs";
import { isCpfValid } from "./validators/cpf.js";
import { isCnpjValid } from "./validators/cnpj.js";
import { validatePayments } from "./validators/paymentValidator.js";
import { formatToBRL } from "./helpers/currencyConverter.js";

// arquivos pequenos podem ser processados com processCsvToArray
processCsvToArray("data.csv")
  .then((data) => {
    // Salvar o novo CSV com os dados convertidos e validados
    saveProcessedCsv(data, "processed_data.csv");
  })
  .catch((error) => console.error(error));

const outputJSONStream = fs.createWriteStream("processed_data.json", {
  flags: "a",
});
const outputCSVSream = fs.createWriteStream("processed_data.csv", {
  flags: "a",
});

// arquivos grandes devem ser processados com processCsvInStream
processCsvInStream("data.csv", onData, onEnd, onError);

// hoisting para podermos definir as funções depois de chamá-las
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
  console.log("CSV e JSON processados com sucesso!");
}

function onError(error) {
  console.error(error);
}
