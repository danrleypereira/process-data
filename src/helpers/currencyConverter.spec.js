import { formatToBRL } from "./currencyConverter";

describe("BRL Currency Converter", () => {
  test("Should format a positive number correctly", () => {
    expect(formatToBRL(1234.56)).toBe("R$ 1.234,56");
  });

  test("Should format an integer number correctly", () => {
    expect(formatToBRL(1000)).toBe("R$ 1.000,00");
  });

  test("Should round a number with more than two decimal places", () => {
    expect(formatToBRL(1234.56789)).toBe("R$ 1.234,57");
  });

  test("Should format zero correctly", () => {
    expect(formatToBRL(0)).toBe("R$ 0,00");
  });

  test("Should format a negative number correctly", () => {
    expect(formatToBRL(-1234.56)).toBe("-R$ 1.234,56");
  });

  test("Should round a very small number to zero", () => {
    expect(formatToBRL(0.0001)).toBe("R$ 0,00");
  });

  test("Should format a very large number correctly", () => {
    expect(formatToBRL(9999999999999.99)).toBe("R$ 9.999.999.999.999,99");
  });

  test("Should throw an error for non-numeric input", () => {
    expect(() => formatToBRL(NaN)).toThrow(
      "Invalid value: input must be a valid number."
    );
    expect(() => formatToBRL(null)).toThrow(
      "Invalid value: input must be a valid number."
    );
    expect(() => formatToBRL(undefined)).toThrow(
      "Invalid value: input must be a valid number."
    );
  });

  test("Should format a numeric string correctly", () => {
    expect(formatToBRL("1234.56")).toBe("R$ 1.234,56");
  });
});
