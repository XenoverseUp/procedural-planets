const lerp = (start: number, end: number, amount: number) =>
  start * (1 - amount) + end * amount;

export default lerp;
