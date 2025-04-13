export enum Suit {  //  the predefined suits of cards
    Diamonds = "♦",
    Hearts = "♥",
    Spades = "♠",
    Clubs = "♣"
}

export interface ICard {    //  interface type for card
    value: number;
    suit: Suit
    getName(): string
}

export interface IDealable {    //  (repartible en español)
    deal(num: number): ICard[], //  deals a number of cards and returns an array of ICard
    reset(): void;              //  we define the method but not the implementation
}