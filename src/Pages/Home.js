import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import './styles.css';
import { BlobButton } from "./components/BlobButton";
import { RoomInput } from "./components/RoomInput";

export const Home = () => {
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

    return (
        <div className="wrapper ">
            {userSet ?
                <div><RoomInput value={roomId} setValue={setRoomId} placeholder={"ROOOMID"}/>
                    <Link to={`/${roomId}`}>
                        <BlobButton text={'Kill'} />
                    </Link></div> :
                <div>
                    <RoomInput value={user} setValue={setUser}  placeholder={"USERNAME"}/>
                    <BlobButton text={'Next'} onClick={() => setUserSet(true)} />
                </div>}
        </div>
    )
}