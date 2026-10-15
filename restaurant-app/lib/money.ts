const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export function toCents(price: number) {
  return Math.round(price * 100);
}

export function formatMoney(cents: number) {
  return euros.format(cents / 100);
}
