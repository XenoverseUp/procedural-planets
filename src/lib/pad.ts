const pad = (
  str: string | number,
  filler: string,
  precision: number,
  direction: "left" | "right" = "left",
) => {
  str = str.toString();

  if (str.length >= precision) return str;

  const arr = str.split("");

  for (let i = 0; i < precision - str.length; i++)
    direction === "left" ? arr.unshift(filler) : arr.push(filler);

  return arr.join("");
};

export default pad;
