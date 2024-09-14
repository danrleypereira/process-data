const isCpfValid = (cpf) => {
  const cleanedCpf = cpf.replace(/\D/g, "");
  if (cleanedCpf.length !== 11) {
    return false;
  }
  return true;
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
};
