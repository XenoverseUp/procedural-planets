class MinMax {
  #min: number = Number.POSITIVE_INFINITY;
  #max: number = Number.NEGATIVE_INFINITY;

  add(value: number) {
    this.#min = Math.min(this.#min, value);
    this.#max = Math.max(this.#max, value);
  }

  get min() {
    return this.#min;
  }

  get max() {
    return this.#max;
  }
}

export default MinMax;
