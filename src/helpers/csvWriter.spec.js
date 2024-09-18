import fs from "fs";
import { saveProcessedCsv } from "./csvWriter";

jest.mock("fs");

describe("CSV Writer", () => {
  test("Should save a processed CSV file with conversions and validations", () => {
    const mockData = [
      {
        nrInst: "31",
        nrAgencia: "16",
        cdClient: "28843",
        nrCpfCnpj: "792608117956",
        qtPrestacoes: "10",
        vlTotal: "40370.2",
        vlPresta: "4037.02",
        vlMora: "0",
        vlMulta: "0",
        vlAtual: "40370.2",
      },
    ];

    saveProcessedCsv(mockData, "processed_data.csv");

    expect(fs.writeFileSync).toHaveBeenCalled();
    const [filePath, csvData] = fs.writeFileSync.mock.calls[0];
    expect(filePath).toBe("processed_data.csv");
    expect(csvData).toContain("isValidCpfOrCNPJ");
    expect(csvData).toContain("vlTotalBRL");
  });
});
