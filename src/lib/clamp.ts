const clamp = (min: number, max: number, value: number) =>
  Math.min(Math.max(value, min), max);

export default clamp;
