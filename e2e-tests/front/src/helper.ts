export function getRange(count: number) {
  return [...new Array(count)].map((_, i) => i + 1);
}
