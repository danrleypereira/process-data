const isCpfValid = (cpf) => {
  // Remove non-digit characters
  const cleanedCpf = cpf.replace(/\D/g, "");

  if (cleanedCpf.length !== 11) {
    return false;
  }
  return true;
};

module.exports = {
  isCpfValid,
};
