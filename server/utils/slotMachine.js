export const symbols = ["C", "L", "O", "W"];

export function getRandomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

export function getReward(symbol) {
  switch (symbol) {
    case "C":
      return 10;
    case "L":
      return 20;
    case "O":
      return 30;
    case "W":
      return 40;
    default:
      return 0;
  }
}
