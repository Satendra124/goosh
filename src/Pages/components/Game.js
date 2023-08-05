import { useEffect, useState } from 'react'
import '../styles.css'
import { addGuess, addRiddle, getState, nextRound } from '../../api/api'
import { NoPlayer } from './NoPlayer';
import { Riddle } from './Riddle';
import { Guess } from './Guess';
import { Result } from './Result';

export const Game = ({ st, role, room }) => {
    const [state, setState] = useState(st);
    useEffect(() => {
        const timer = setInterval(() => refresh(), 1e3)
        return () => clearInterval(timer)
    }, [])

    const [riddle, setRiddle] = useState('');

    const refresh = async () => {
        const newState = await getState(room);
        setState(newState);
    }
    const onRiddle = async (riddle) => {
        const newState = await addRiddle(room, riddle, role);
        setState(newState);
    }

    const onGuess = async (guess) => {
        const newState = await addGuess(room, guess, role);
        setState(newState);
    }
    useEffect(() => {
        const currentRound = state.results[state.results.length - 1];
        for (let ridd of currentRound.riddles) {
            if (ridd.to == role) {
                setRiddle(ridd.riddle)
                break;
            }
        }
    }, [state])

    const onNextRound = async () => {
        const newState = await nextRound(room);
        setState(newState);
    }
    return <div>
        <div>
            RIDDLE: {riddle}
        </div>
        <div>
            {
                state.state === 'NO_PLAYER' ?
                    <div><NoPlayer room={room} /></div> :
                    state.state === 'NO_RIDDLE' ?
                        <div><Riddle onRiddle={onRiddle} /></div> :
                        state.state === (parseInt(!role) + '_RIDDLE') ? //opponent submmited riddle notify
                        <div><Riddle onRiddle={onRiddle} /></div> :
                            state.state === (parseInt(role) + '_RIDDLE') ?
                                <div>Awaiting Riddle from opponent</div> :
                                state.state === '0_RIDDLE_1_RIDDLE' ?
                                    <div><Guess onGuess={onGuess} /></div> :
                                    state.state === role + '_WON' ?
                                        <div><Result onNext={onNextRound} won={true}/></div> :
                                        state.state === parseInt(!role) + '_WON' ?
                                            <div><Result onNext={onNextRound} won={false}/></div> :
                                            state.state === 'GAME_OVER' ?
                                                <div>GAME OVER</div> :
                                                <div>UNKNOWN STATE: {state.state}</div>
            }
        </div>
        <div>
            <div>Room: {room}</div>
            <div>State: {JSON.stringify(state, null, 4)}</div>
            <div>Role: {role}</div>
        </div>
    </div>

}