export const formatToBRL = (value) => {
  if (typeof value === "string" && !isNaN(Number(value))) {
    value = Number(value);
  }

  if (typeof value !== "number" || isNaN(value)) {
    throw new Error("Invalid value: input must be a valid number.");
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
