import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enterRoom } from "../api/api";
import { Game } from "./components/Game";

export const Room = () => {
    let { id } = useParams();
    const [state, setState] = useState(null);
    const [role, setRole] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [user,setUser] = useState(localStorage.getItem('user'));
    useEffect(() => {
        if(!user){
            navigate('/');
            return;
        }
        const st = enterRoom(id);
        st.then((stt) => {
            setRole(stt.you);
            setState(stt);
        }).catch((e) => {
            console.log("error: ",e);
            setError(e);
        })
    }, []);

    return (
        <div>
            {
                error ?
                    <div>ERROR: {JSON.stringify(error, null, 2)}</div> :
                    state == null ?
                        <div>LOADING</div> :
                        <div><Game role={role} room={id} st={state}/></div>
            }
        </div>
    )
}