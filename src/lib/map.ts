const map = (low: number, high: number, progress: number) =>
  (progress - low) / (high - low);

export default map;
