import { useEffect, useState } from "react";
import { PaperCard } from "./common/PaperCard"
import { Link } from "react-router-dom";
import '../styles.css';
export const Welcome = () => {
    const [roomId, setRoomId] = useState('');
    const [user, setUser] = useState(null);
    const [userSet, setUserSet] = useState(false);
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(user);
            setUserSet(true);
        }
    }, [])
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', user);
        }
    }, [user])
    const onUser = (user) => {
        setUserSet(true);
    }
    return (
        <div className="wrapper-welcome">
            <PaperCard className="paper-card">
                Welcome {user}! <br />
                How to play: <br />
                1. Add Attributes like Love, Health, or anything comes to your mind<br />
                2. write messages to make your opponents one of attribute zero<br />
                3. Any attribute reaching zero means Lost <br />
                4. There will be a max of 10 rounds <br />
                <br />
                <br />
                {
                    !userSet ?
                        <div>
                            What's your username? <input value={user} onChange={(e) => setUser(e.target.value)} />
                            <button onClick={() => onUser(user)}>Next</button>
                        </div> :
                        <div>
                            <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder={"ROOOMID"} style={{zIndex:1000}}/>
                            <Link to={`/${roomId}`}>
                                <button>Join</button>
                            </Link>
                        </div>

                }

            </PaperCard>
        </div>
    )
}