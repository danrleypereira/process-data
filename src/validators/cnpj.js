export const isCnpjValid = (cnpj) => {
  const cleanedCnpj = cnpj.replace(/\D/g, "");
  if (cleanedCnpj.length !== 14) {
    return false;
  }

  return isCnpjVerificationDigitsValid(
    cleanedCnpj.slice(0, 12),
    cleanedCnpj.slice(12, 14)
  );
};

const isCnpjVerificationDigitsValid = (cnpjBase, verificationDigits) => {
  const firstDigit = calculateCnpjFirstDigit(cnpjBase);
  const secondDigit = calculateCnpjSecondDigit(cnpjBase, firstDigit);

  return `${firstDigit}${secondDigit}` === verificationDigits;
};

const calculateCnpjFirstDigit = (cnpjBase) => {
  const cnpjArray = cnpjBase.split("").map(Number);
  const multipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const sum = cnpjArray.reduce(
    (acc, num, index) => acc + num * multipliers[index],
    0
  );

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

const calculateCnpjSecondDigit = (cnpjBase, firstDigit = undefined) => {
  const cnpjArray = cnpjBase.split("").map(Number);
  cnpjArray.push(firstDigit || calculateCnpjFirstDigit(cnpjBase));

  const multipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const sum = cnpjArray.reduce(
    (acc, num, index) => acc + num * multipliers[index],
    0
  );

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};
