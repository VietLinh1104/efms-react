export function formatCurrency(value: number): string {
  if (value === 0) return "—";
  return new Intl.NumberFormat('vi-VN').format(value);
}
