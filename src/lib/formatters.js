export function formatCurrency(amount, settings) {
  const value = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const symbol = settings?.regional?.currencySymbol || "Rs";
  const numberFormat = settings?.regional?.numberFormat || "1,234.56";

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: numberFormat.includes(".") ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return `${symbol} ${formatted}`;
}
export function formatDate(date, settings) {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "-";

  const dateFormat = settings?.regional?.dateFormat || "DD/MM/YYYY";

  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = value.getFullYear();

  if (dateFormat === "MM/DD/YYYY") {
    return `${month}/${day}/${year}`;
  }

  if (dateFormat === "YYYY-MM-DD") {
    return `${year}-${month}-${day}`;
  }

  return `${day}/${month}/${year}`;
}