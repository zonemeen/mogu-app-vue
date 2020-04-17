function twoDecimalPlaces(value: number) {
  const integer = value.toString().split(".")[0];
  let decimal = value.toString().split(".")[1];
  if (decimal) {
    decimal = decimal.slice(0, 2);
  }
  return parseFloat([integer, decimal].join("."));
}

export { twoDecimalPlaces };
