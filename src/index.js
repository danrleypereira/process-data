import { processCsvToArray } from "./helpers/csvProcessor.js";

processCsvToArray("data.csv")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
