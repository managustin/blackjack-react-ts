import { ICard } from "./types";

export function getHandValue(cards: ICard[]): number {
  // returns the numeric value of a hand
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if(card.value >= 10){
        value += 10
    } else if (card.value === 1) {
        aces += 1;
        value += 11;
    } else {
        value += card.value;
    }
  }

  while(value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
}

export function shuffleArray<T>(array: T[]) {   //Fisher-Yates's algorithm for shuffling.
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}