export const validatePayments = (data) => {
  return new Promise((resolve, reject) => {
    const { qtPrestacoes, vlTotal, vlPresta } = data;

    const paymentsQuantity = Number(qtPrestacoes);
    const fullPayment = Number(vlTotal);
    const PaymentPortion = Number(vlPresta);

    const expectedPaymentPortion = fullPayment / paymentsQuantity;

    // Valida se o valor de cada prestação está correto
    if (Math.abs(expectedPaymentPortion - PaymentPortion) < 0.01) {
      resolve({ ...data, isValid: true });
    } else {
      resolve({ ...data, isValid: false, error: "Invalid installment value" });
    }
  });
};

export const validateAllPayments = (dataArray) => {
  const promises = dataArray.map((data) => validatePayments(data));
  return Promise.all(promises);
};
