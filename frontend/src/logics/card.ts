import { ICard, Suit } from "./types";

class Card implements ICard{    //by implementing ICard, the class Card must have the attributes and methods defined by the interface
    static readonly CARD_VALUES: Record<number, string> = { //static means this property belongs to the class, not the instances. Readonly prevents it from being modified after defined
        1: "A",     //Record is a way of saying the CARD_VALUES object has keys of type number and values of type string
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
        11: "J",
        12: "Q",
        13: "K"
    }

    value: number;
    suit: Suit;

    constructor(value: number, suit: Suit) {
        this.value = value;
        this.suit = suit
    }

    getName() {
        return Card.CARD_VALUES[this.value]
    }
}

export default Card;