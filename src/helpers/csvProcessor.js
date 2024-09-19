import fs from "fs";
import csv from "csv-parser";
import csvParser from "csv-parser";

// this function is used to process the CSV file and return an array of objects
// this loads the entire file into memory, so it's not recommended for large files
export const processCsvToArray = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

// this function is used to process the CSV file in a stream
// this is recommended for large files, as it doesn't load the entire file into memory
export const processCsvInStream = (filePath, onData, onEnd, onError) => {
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", onData)
    .on("end", onEnd)
    .on("error", onError);
};
