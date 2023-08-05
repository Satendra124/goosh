import { useState } from "react"

export const Guess = ({ onGuess }) => {
    const [guess, setGuess] = useState('');
    return (
        <div>
            <input type="text" onChange={(e) => setGuess(e.target.value)} value={guess} />
            <button onClick={() => {onGuess(guess);setGuess('')}}>Guess</button>
        </div>
    );
}