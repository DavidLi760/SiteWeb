export type DeliveryAddress = {
  street: string;
  postalCode: string;
  city: string;
  details: string;
};

export function parseDeliveryAddress(value: unknown): DeliveryAddress | null {
  if (!value || typeof value !== "object") return null;
  const fields = value as Record<string, unknown>;
  const clean = (key: string, max: number, required = true) => {
    const text = fields[key] ?? (required ? null : "");
    if (typeof text !== "string" || text.length > max || /[\r\n\x00-\x1f\x7f]/.test(text)) return null;
    return required && !text.trim() ? null : text.trim();
  };
  const street = clean("street", 200);
  const postalCode = clean("postalCode", 20);
  const city = clean("city", 100);
  const details = clean("details", 300, false);
  if (street === null || postalCode === null || city === null || details === null) return null;
  return { street, postalCode, city, details };
}
