import { ICard } from "./types";
import promptSync from "prompt-sync";
const prompt = promptSync();

export function getDecision(): "hit" | "stand" {
  let decision: string;
  do {
    decision = prompt("Hit or stand? (h/s): ").toLowerCase();
  }while(decision!=='h' && decision!=='s');

  return decision === 'h' ? 'hit' : 'stand';
}

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

export function getBet(balance: number): number {
  while (true) {
    const bet = prompt("Enter your bet: ");
    if (bet === null || bet.trim() === "") {
      console.log("Invalid input. Please enter a number.");
      continue;
    }

    const numBet = Number(bet);

    if (!isNaN(numBet) && numBet > 0 && numBet <= balance) {
      return numBet;
    }

    console.log("Invalid bet. Try again.");
  }
}
export function getStrHand(hand: ICard[], hideSecondCard: boolean = false): string {

    let str = "";

    for (const [idx, card] of hand.entries()) {
        if (idx !== 0) str += ", "
        if (idx === 1 && hideSecondCard) {
            str += "[hidden]"
            break;
        }
        str += `${card.getName()}${card.suit}`
    }

    return str;
}
