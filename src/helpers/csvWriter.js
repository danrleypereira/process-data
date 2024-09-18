import fs from "fs";
import { formatToBRL } from "./currencyConverter.js";
import {
  isCnpjValid,
  isCpfValid,
  validatePayments,
} from "../validators/index.js";
import { parse } from "json2csv";

export const saveProcessedCsv = (dataArray, outputFile) => {
  const processedData = dataArray.map((data) => {
    const isValidCpfOrCNPJ =
      isCpfValid(data.nrCpfCnpj) || isCnpjValid(data.nrCpfCnpj);
    const isPaymentValid = validatePayments(data).isValid;

    // Convertendo todas as moedas para BRL
    const vlTotalBRL = formatToBRL(data.vlTotal);
    const vlPrestaBRL = formatToBRL(data.vlPresta);
    const vlMoraBRL = formatToBRL(data.vlMora);
    const vlMultaBRL = formatToBRL(data.vlMulta);
    const vlAtualBRL = formatToBRL(data.vlAtual);

    // Retornando os dados processados com as novas colunas
    return {
      ...data,
      isValidCpfOrCNPJ,
      isPaymentValid,
      vlTotalBRL,
      vlPrestaBRL,
      vlMoraBRL,
      vlMultaBRL,
      vlAtualBRL,
    };
  });

  const csv = parse(processedData);

  fs.writeFileSync(outputFile, csv);
  return processedData;
};
