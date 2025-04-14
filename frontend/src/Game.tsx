import { useEffect, useState } from "react";
import Deck from "./logics/deck";
import Card from "./logics/card";
import { getHandValue } from "./logics/utils";

function Game() {
    const [deck, setDeck] = useState<Deck | null>(null);
    const [playerCards, setPlayerCards] = useState<Card[]>([]);
    const [dealerCards, setDealerCards] = useState<Card[]>([]);
    const [playerHandValue, setPlayerHandValue] = useState<number>(0);
    const [dealerHandValue, setDealerHandValue] = useState<number>(0);
    const [gameState, setGameState] = useState<string>("playing"); // "playing", "won", "lost", "bust", "blackjack"
    const [dealerCardHidden, setDealerCardHidden] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const newDeck = new Deck();
        newDeck.reset();
        setDeck(newDeck);

        const initialPlayerCards = newDeck.deal(2);
        const initialDealerCards = newDeck.deal(2);
        
        const playerValue = getHandValue(initialPlayerCards);
        const dealerValue = getHandValue(initialDealerCards);

        setPlayerCards(initialPlayerCards);
        setDealerCards(initialDealerCards);
        setPlayerHandValue(playerValue);
        setDealerHandValue(dealerValue);
        setDealerCardHidden(true);
        
        // Check for natural blackjack
        if (playerValue === 21) {
            if (dealerValue === 21) {
                setGameState("draw");
                setMessage("Both have Blackjack! It's a Draw! 🎲");
                setDealerCardHidden(false);
            } else {
                setGameState("blackjack");
                setMessage("Blackjack! You Won! 🎉");
                setDealerCardHidden(false);
            }
        } else if (dealerValue === 21) {
            setGameState("lost");
            setMessage("Dealer has Blackjack! You Lost! ❌");
            setDealerCardHidden(false);
        } else {
            setGameState("playing");
            setMessage("");
        }
    };

    const drawCard = () => {
        if (deck && gameState === "playing") {
            const newCard = deck.deal(1)[0];
            if (newCard) {
                const updatedCards = [...playerCards, newCard];
                const newValue = getHandValue(updatedCards);
                
                setPlayerCards(updatedCards);
                setPlayerHandValue(newValue);

                // Check for bust
                if (newValue > 21) {
                    setGameState("bust");
                    setMessage("Bust! You Lost! ❌");
                    setDealerCardHidden(false);
                }
            }
        }
    };

    const stand = () => {
        if (gameState === "playing") {
            setDealerCardHidden(false);

            if (deck) {
                let dealerTurnCards = [...dealerCards];
                let dealerValue = getHandValue(dealerTurnCards);

                while (dealerValue < 17) {
                    const newCard = deck.deal(1)[0];
                    if (newCard) {
                        dealerTurnCards.push(newCard);
                        dealerValue = getHandValue(dealerTurnCards);
                    }
                }

                setDealerCards(dealerTurnCards);
                setDealerHandValue(dealerValue);

                // Determine game result
                if (dealerValue > 21) {
                    setGameState("won");
                    setMessage("Dealer Bust! You Won! 🎉");
                } else if (dealerValue < playerHandValue) {
                    setGameState("won");
                    setMessage("You Won! 🎉");
                } else if (dealerValue === playerHandValue) {
                    setGameState("draw");
                    setMessage("It's a Draw! 🎲");
                } else {
                    setGameState("lost");
                    setMessage("Dealer Wins! You Lost! ❌");
                }
            }
        }
    };

    return (
        <div className="min-h-screen w-screen bg-[var(--game-bg)] flex items-center justify-center overflow-x-hidden">
            <div className="w-full max-w-4xl mx-auto px-4 py-6">
                <div className="flex flex-col items-center justify-center space-y-8">
                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-6 text-center">Blackjack</h1>

                    {/* Dealer's section */}
                    <div className="w-full flex flex-col items-center">
                        <h2 className="text-2xl text-[var(--text-primary)] mb-4">Dealer's Hand</h2>
                        <div className="flex justify-center gap-3 mb-3">
                            {dealerCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`w-24 h-36 bg-[var(--card-bg)] text-black rounded-lg shadow-xl 
                                              flex items-center justify-center text-2xl font-bold 
                                              transform hover:scale-105 transition-transform
                                              ${index === dealerCards.length - 1 && !dealerCardHidden ? 'slide-animation' : 'deal-animation'}`}
                                    style={{ animationDelay: `${index * 200}ms` }}
                                >
                                    {index === 0 || !dealerCardHidden ? (
                                        <span>{card.getName()}{card.suit}</span>
                                    ) : (
                                        <div className="card-back">🂠</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!dealerCardHidden && (
                            <p className="text-xl text-[var(--text-primary)] mt-2">Value: {dealerHandValue}</p>
                        )}
                    </div>

                    {/* Player's section */}
                    <div className="w-full flex flex-col items-center mt-6">
                        <h2 className="text-2xl text-[var(--text-primary)] mb-4">Player's Hand</h2>
                        <div className="flex justify-center gap-3 mb-3">
                            {playerCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`w-24 h-36 bg-[var(--card-bg)] text-black rounded-lg shadow-xl 
                                              flex items-center justify-center text-2xl font-bold 
                                              transform hover:scale-105 transition-transform
                                              ${playerCards.length > 2 && index === playerCards.length - 1 ? 'slide-animation' : 'deal-animation'}`}
                                    style={{ animationDelay: `${(index + 2) * 200}ms` }}
                                >
                                    {card.getName()}{card.suit}
                                </div>
                            ))}
                        </div>
                        <p className="text-xl text-[var(--text-primary)] mt-2">Value: {playerHandValue}</p>
                    </div>

                    {/* Game controls */}
                    <div className="mt-6 flex flex-col items-center gap-4">
                        {gameState === "playing" ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={drawCard}
                                    disabled={playerHandValue >= 21}
                                    className={`px-6 py-3 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 
                                              ${playerHandValue >= 21
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : "bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)] text-white hover:shadow-lg"
                                              }`}
                                >
                                    Hit
                                </button>
                                <button
                                    onClick={stand}
                                    className="px-6 py-3 bg-[var(--button-secondary)] hover:bg-[var(--button-secondary-hover)] text-white rounded-lg 
                                             text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    Stand
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <h2 className="text-3xl font-bold text-[var(--text-primary)] animate-bounce">{message}</h2>
                                <button
                                    onClick={startNewGame}
                                    className="px-6 py-3 bg-[var(--button-success)] hover:bg-[var(--button-success-hover)] text-white rounded-lg 
                                             text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                >
                                    Play Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Game;