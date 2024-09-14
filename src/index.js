const isCpfValid = (cpf) => {
  const cleanedCpf = cpf.replace(/\D/g, "");
  if (cleanedCpf.length !== 11) {
    return false;
  }
  if (
    isVerificationDigitsValid(cleanedCpf.slice(0, 9), cleanedCpf.slice(9, 11))
  ) {
    return true;
  }
  return false;
};

const isVerificationDigitsValid = (cpf, verificationDigits) => {
  const firstDigit = calculateFirstDigit(cpf);
  const secondDigit = calculateSecondDigit(cpf);

  return `${firstDigit}${secondDigit}` === verificationDigits;
};

const calculateFirstDigit = (cpf) => {
  const cpfArray = cpf.slice(0, 9).split("").map(Number);
  const multiplicadores = [10, 9, 8, 7, 6, 5, 4, 3, 2];

  const soma = cpfArray.reduce(
    (acc, num, index) => acc + num * multiplicadores[index],
    0
  );

  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
};

const calculateSecondDigit = (cpf) => {
  const cpfArray = cpf.slice(0, 9).split("").map(Number);
  cpfArray.push(calculateFirstDigit(cpf));

  const multiplicadores = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

  const soma = cpfArray.reduce(
    (acc, num, index) => acc + num * multiplicadores[index],
    0
  );

  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
};

const isCnpjValid = (cnpj) => {
  const cleanedCnpj = cnpj.replace(/\D/g, "");
  if (cleanedCnpj.length !== 14) {
    return false;
  }
  return true;
};

module.exports = {
  isCpfValid,
  isCnpjValid,
  calculateFirstDigit,
  calculateSecondDigit,
};
