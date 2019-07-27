export function random(from: number, to: number): number {
  return Math.round(Math.random() * (to - from)) + from;
}