const { isCpfValid } = require("./index");

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
