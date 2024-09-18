import { processCsvToArray } from "./helpers/csvProcessor.js";
import { saveProcessedCsv } from "./helpers/csvWriter.js";

processCsvToArray("data.csv")
  .then((data) => {
    // Salvar o novo CSV com os dados convertidos e validados
    saveProcessedCsv(data, "processed_data.csv");
  })
  .catch((error) => console.error(error));
