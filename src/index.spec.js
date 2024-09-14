const {
  isCpfValid,
  isCnpjValid,
  calculateFirstDigit,
  calculateSecondDigit,
} = require("./index");

describe("CPF Calculation and Validation", () => {
  describe("Digit verification", () => {
    test("Should correctly calculate the first digit of a valid CPF", () => {
      const cpf = "111444777";
      expect(calculateFirstDigit(cpf)).toBe(3);
    });

    test("Should correctly calculate the second digit of a valid CPF", () => {
      const cpf = "111444777";
      expect(calculateSecondDigit(cpf)).toBe(5);
    });

    test("Should return an incorrect first digit for an invalid CPF", () => {
      const cpf = "123456789";
      expect(calculateFirstDigit(cpf)).not.toBe(3);
    });

    test("Should return an incorrect second digit for an invalid CPF", () => {
      const cpf = "123456789";
      expect(calculateSecondDigit(cpf)).not.toBe(5);
    });
  });

  describe("isCpfValid", () => {
    test("Should remove non-digit characters from the CPF", () => {
      const cpfWithMask = "123.456.789-09";
      expect(isCpfValid(cpfWithMask)).toBe(true);
    });

    test("Should return false if CPF has less than 11 digits", () => {
      const invalidCpf = "123.456.789";
      expect(isCpfValid(invalidCpf)).toBe(false);
    });

    test("Should return false if CPF has more than 11 digits", () => {
      const invalidCpf = "123.456.789.0987";
      expect(isCpfValid(invalidCpf)).toBe(false);
    });

    test("Should return true for a valid CPF with exactly 11 digits", () => {
      const validCpf = "12345678909";
      expect(isCpfValid(validCpf)).toBe(true);
    });

    test("Should return false for an invalid CPF with incorrect digits", () => {
      const invalidCpf = "11144477736";
      expect(isCpfValid(invalidCpf)).toBe(false);
    });
  });
});

describe("CNPJ Validation", () => {
  test("Should remove non-digit characters from the CNPJ", () => {
    const cnpjWithMask = "12.345.678/0001-95";
    expect(isCnpjValid(cnpjWithMask)).toBe(true);
  });

  test("Should return false if CNPJ has less than 14 digits", () => {
    const invalidCnpj = "12.345.678/0001";
    expect(isCnpjValid(invalidCnpj)).toBe(false);
  });

  test("Should return false if CNPJ has more than 14 digits", () => {
    const invalidCnpj = "12.345.678/0001-9555";
    expect(isCnpjValid(invalidCnpj)).toBe(false);
  });

  test("Should return true for a valid CNPJ with exactly 14 digits", () => {
    const validCnpj = "12345678000195";
    expect(isCnpjValid(validCnpj)).toBe(true);
  });
});
