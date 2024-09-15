import { isCnpjValid } from "./cnpj";

describe("CNPJ Validation", () => {
  test("Should return true for a valid CNPJ", () => {
    const validCnpj = "11.222.333/0001-81";
    expect(isCnpjValid(validCnpj)).toBe(true);
  });

  test("Should return false if CNPJ has less than 14 digits", () => {
    const invalidCnpj = "12.345.678/0001";
    expect(isCnpjValid(invalidCnpj)).toBe(false);
  });

  test("Should return false if CNPJ has more than 14 digits", () => {
    const invalidCnpj = "12.345.678/0001-9555";
    expect(isCnpjValid(invalidCnpj)).toBe(false);
  });

  test("Should remove non-digit characters from the CNPJ and validate it", () => {
    const cnpjWithMask = "12.345.678/0001-95";
    expect(isCnpjValid(cnpjWithMask)).toBe(true);
  });

  test("Should return false for a CNPJ with valid format but incorrect verification digits", () => {
    const invalidCnpj = "12.345.678/0001-82";
    expect(isCnpjValid(invalidCnpj)).toBe(false);
  });

  test("Should return false for a CNPJ with valid format but incorrect verification digits", () => {
    const invalidCnpj = "11.222.333/0001-99";
    expect(isCnpjValid(invalidCnpj)).toBe(false);
  });
});
