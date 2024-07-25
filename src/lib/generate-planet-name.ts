function getRandomElement(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(word: string): string {
  if (word.length === 0) return word;
  return word[0].toUpperCase() + word.slice(1);
}

// Planet name
const prefixes = [
  "Astra",
  "Terra",
  "Luna",
  "Stella",
  "Nebula",
  "Zeta",
  "Nova",
  "Gal",
  "Orion",
  "Cosmo",
  "Proxima",
  "Vega",
];
const roots = [
  "sol",
  "bor",
  "tarn",
  "lum",
  "ner",
  "zar",
  "mira",
  "kan",
  "thar",
  "xen",
  "cal",
  "vir",
  "pol",
  "rax",
];
const infixes = ["li", "ve", "no", "ri", "ta", "si", "ra", "xo", "mu", "za"];
const suffixes = [
  "is",
  "ia",
  "us",
  "on",
  "ar",
  "os",
  "ium",
  "an",
  "al",
  "or",
  "ix",
  "ion",
  "ara",
  "iel",
];
const modifiers = [
  "Prime",
  "Major",
  "Minor",
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Exo",
  "Inferno",
];

export function generatePlanetName(): string {
  const prefix = Math.random() > 0.5 ? getRandomElement(prefixes) : "";
  const root = getRandomElement(roots);
  const infix = Math.random() > 0.3 ? getRandomElement(infixes) : "";
  const suffix = getRandomElement(suffixes);
  const modifier = Math.random() > 0.7 ? ` ${getRandomElement(modifiers)}` : "";

  let planetName = prefix + root + infix + suffix;
  planetName = capitalize(planetName) + modifier;

  return planetName;
}

// Planet Facts
const adjectives = [
  "mysterious",
  "ancient",
  "frigid",
  "scorching",
  "gigantic",
  "tiny",
  "enigmatic",
  "verdant",
  "arid",
  "luminous",
  "volatile",
  "ethereal",
  "whimsical",
];
const features = [
  "rings",
  "moons",
  "oceans of lava",
  "forests of crystal",
  "cities of glass",
  "mountains of gold",
  "winds that sing",
  "deserts of diamonds",
  "underground oceans",
  "alien ruins",
  "floating islands",
  "caves of ice",
];
const creatures = [
  "giant worms",
  "floating jellyfish",
  "invisible dragons",
  "robotic birds",
  "talking trees",
  "glowing fungi",
  "crystal golems",
  "shadowy creatures",
  "electric eels",
  "singing rocks",
  "levitating octopuses",
  "lightning cats",
];
const phenomena = [
  "time moves slower",
  "gravity is reversed",
  "day and night last for months",
  "the rain is bioluminescent",
  "auroras are visible every night",
  "magnetic storms shape the landscape",
  "volcanic eruptions are synchronized with the planet's moons",
  "the sky changes color every hour",
];
const rumors = [
  "They say on this planet, the sunsets last for hours and are always green.",
  "It's rumored that a secretive species of aliens control the weather here.",
  "Whispers tell of an ancient artifact buried deep beneath the surface.",
  "Legend has it that the planet's core is made entirely of a rare element.",
  "Locals believe the planet's moons align perfectly once every millennium, creating a cosmic dance in the sky.",
  "It's said that the planet's flora sings a symphony during the full moon.",
  "Some believe the planet was once home to a lost civilization with advanced technology.",
  "There are stories of a hidden portal on this planet that leads to another dimension.",
  "They say the water on this planet has healing properties and can cure any disease.",
  "Some claim the planet's mountains glow at night, revealing a secret map.",
  "Rumors abound of a treasure hidden in the deepest cave, guarded by ancient guardians.",
  "It's whispered that the planet's weather patterns are controlled by an unknown force.",
  "Legends tell of a massive creature that sleeps beneath the planet's oceans, causing tidal waves when it stirs.",
  "They say the planet's atmosphere contains a rare gas that induces vivid dreams.",
  "It's rumored that the planet's inhabitants communicate through telepathy.",
];

export function generatePlanetFact(planetName?: string): string {
  const adjective = getRandomElement(adjectives);
  const feature = getRandomElement(features);
  const creature = getRandomElement(creatures);
  const phenomenon = getRandomElement(phenomena);
  const rumor = getRandomElement(rumors);

  const factType = Math.random() > 0.5 ? "fact" : "rumor";

  let fact: string;
  if (factType === "fact") {
    const sentenceStructure = Math.random();
    if (sentenceStructure < 0.25) {
      fact = `This planet is known for its ${adjective} ${feature}, where ${creature} are often seen.`;
    } else if (sentenceStructure < 0.5) {
      fact = `On this planet, ${phenomenon}, and ${creature} can be found near the ${feature}.`;
    } else if (sentenceStructure < 0.75) {
      fact = `The ${adjective} landscape of this planet includes ${feature} and is home to ${creature}.`;
    } else {
      fact = `Travelers have reported that ${creature} inhabit the ${feature} of this ${adjective} planet.`;
    }
  } else {
    fact = rumor;
  }

  if (planetName && Math.random() > 0.5) {
    if (fact.startsWith("This planet")) {
      fact = fact.replace("This planet", `The planet ${planetName}`);
    } else {
      fact = fact.replace("this planet", `the planet ${planetName}`);
    }
  }

  return fact;
}
