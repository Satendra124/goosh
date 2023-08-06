import { useEffect, useRef, useState } from 'react';
import '../styles.css';
import { sendMessage } from '../../api/api';
import { useNavigate } from 'react-router-dom';

export const Game = ({ state, room, user }) => {
    const navigate = useNavigate();
    console.log(state, room, user);
    const [message, setMessage] = useState('');
    const [loading,setLoading] = useState(false);
    const messages = [
        {
            role: "Refree",
            message: `Welcome to the game ${user} you are in room: ${room}`
        }
    ]


    // add prompts to message
    for (let prompt of state.prompts) {
        if (prompt.role === 'system') continue;
        if (prompt.role === 'user') {
            const content = prompt.content;
            const messages_from_content = content.split('\n');
            const player1 = messages_from_content[0].split(':')[0];
            const player2 = messages_from_content[1].split(':')[0];
            const player1_message = messages_from_content[0].split(':')[1];
            const player2_message = messages_from_content[1].split(':')[1];
            messages.push({
                role: player1,
                message: player1_message
            })
            messages.push({
                role: player2,
                message: player2_message
            })
        } else {
            const res = JSON.parse(prompt.content);
            messages.push({
                role: "Refree",
                message: res.reason
            })
        }
    }

    let isChallenger = false, canSendMessage = true;

    if (state.current_round.challenger === user) {
        isChallenger = true;
    }

    if (isChallenger && state.current_round.challenger_message) {
        // you are challenger and you have sent a message
        messages.push({
            role: "Refree",
            message: "Your message have been sent!"
        })
        canSendMessage = false;
    }
    if (!isChallenger && !state.current_round.challenger_message) {
        // you need to wait for challenger to send message
        messages.push({
            role: "Refree",
            message: "Waiting for challenger to send message"
        })
        canSendMessage = false;
    }
    if (!isChallenger && state.current_round.challenger_message) {
        // you are replier and you have to sent a message
        messages.push({
            role: "Refree",
            message: "Please send a message"
        });
        canSendMessage = true;
    }

    if (!state) {
        return (
            <div className="loading-game-wrapper">
                <div className="lds-ripple"><div></div><div></div></div>
            </div>
        );
    }

    if (state.prompts.length === 0) {
        // waiting for other player
        return (
            <div className="loading-game-wrapper">
                Loading for Other Player
            </div>
        )
    }


    const onMessage = async () => {
        setLoading(true)
        try {
            const res = await sendMessage(room, message);
            console.log(res);
            setMessage('');
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
        
    }

    if (state.current_round.challenger_message) {
        messages.push({
            role: state.current_round.challenger,
            message: state.current_round.challenger_message
        })
    }

    // check if game is finished
    let game_over = false;
    let looser = '';
    for (let player_atr of state.attr) {
        for (let attribute of player_atr.attributes) {
            if (attribute.value === 0) {
                game_over = true;
                looser = player_atr.player;
            }
        }
    }
    if (game_over) {
        if (looser === user) {
            navigate('/lost');
        } else {
            navigate('/won');
        }
    }

    const onEnter = (e) => {
        if (e.key === 'Enter') {
            onMessage();
        }
    }
    return (
        <div className='game-wrapper'>
            <div className='attributes-list'>
                {state.attr.map((player, index) => (
                    <div key={index} className='player-attributes-wrapper'>
                        <div className='player-name'>{player.player}{player.player === user ? '(You)': null}</div>
                        <div className='attributes-bars-wrapper'>
                            {player.attributes.map((attribute, index) => (
                                <div className='attribute-bar' key={index}>
                                    <div className='attribute-name'>{attribute.name}</div>
                                    <div className='attribute-value-bar'>
                                        <div
                                            className='attribute-value'
                                            style={{ width: `${attribute.value*10}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='current-round-wrapper'>
            <div className='message-list'>
                {messages.map((message, index) => (
                    <div className='message-wrapper' key={index}>
                        <div className='message-role'>{message.role}</div>
                        <div className='message-content'>{message.message}</div>
                    </div>
                ))}
            </div>
            <div className='chat-input-wrapper'>
                <input
                    type='text'
                    className='chat-input'
                    placeholder='Type your message here'
                    disabled={!canSendMessage || loading}
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={onEnter}
                />
                {loading?
                <div style={{width:'50px',height:'50px'}}><div class="lds-ripple"><div></div><div></div></div></div>
                :<button className='chat-send-button' disabled={!canSendMessage} onClick={onMessage}>
                    Send
                </button>}
            </div>
            </div>
        </div>
    );

}