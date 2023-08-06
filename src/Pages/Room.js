import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enterRoom, getRoom } from "../api/api";
import { Game } from "./components/Game";
import './styles.css';
import { PaperCard } from "./components/common/PaperCard";
import { SetAttributes } from "./components/SetAttributes";

export const Room = () => {
    let { id:room } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState(null);
    const [error, setError] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [isAttrSet, setIsAttrSet] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/');
        }
        if (localStorage.getItem('attributes')) {
            const attributes = JSON.parse(localStorage.getItem('attributes'));
            onAttr(attributes);
        }
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    const refresh = async () => {
        const st = await getRoom(room);
        setState(st);
    }

    const init = async () => {
        try {
            setLoading(true);
            const atr = JSON.parse(localStorage.getItem('attributes'));
            const st = await enterRoom(room, atr);
            setState(st);
            setLoading(false);
            // start refresh every 1 sec
            setInterval(refresh, 1000);
        } catch (error) {
            setError(error.message);
            console.log("error: ",error.message);
            setLoading(false);
        }
    }

    const onAttr = (attributes) => {
        if(attributes.length === 0) return;
        setAttributes(attributes);
        setIsAttrSet(true);
        localStorage.setItem('attributes', JSON.stringify(attributes));
        init();
    }

    return (
        <div>
            {
                isAttrSet ?
                    loading ?
                        <div className="loading-game-wrapper">
                            <div class="lds-ripple"><div></div><div></div></div>
                        </div> :
                        error ?
                            <PaperCard>
                                <div className="column-flex">
                                    Something went wrong
                                    <span style={{ color: "black", fontSize: 10 }}>{JSON.stringify(error)}</span>
                                </div>
                            </PaperCard>
                            :
                            <Game room={room} state={state} user={localStorage.getItem('user')}/> :
                    <SetAttributes onAttrSet={onAttr} />
            }
        </div>
    );


}