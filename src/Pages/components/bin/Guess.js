import { useState } from "react"
import '../styles.css'
import { BlobButton } from "../common/BlobButton";
export const Guess = ({ riddle,onGuess }) => {
    const [guess, setGuess] = useState('');
    return (
        <div className="guess-wrapper">
            <div className="riddle-box">{riddle}</div>
            <input type="text" onChange={(e) => setGuess(e.target.value)} value={guess} />
            <BlobButton onClick={() => {onGuess(guess);setGuess('')}} text={'Guess'}/>
        </div>
    );
}