import { validatePayments } from "./paymentValidator";

describe("Installment Validation", () => {
  test("Should validate correct installment value", async () => {
    const data = {
      qtPrestacoes: "10",
      vlTotal: "1000",
      vlPresta: "100",
    };

    const result = await validatePayments(data);
    expect(result.isValid).toBe(true);
  });

  test("Should invalidate incorrect installment value", async () => {
    const data = {
      qtPrestacoes: "10",
      vlTotal: "1000",
      vlPresta: "90",
    };

    const result = await validatePayments(data);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Invalid installment value");
  });
});
