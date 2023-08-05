import { useState } from "react"

export const Riddle = ({onRiddle}) => {
    const [riddle,setRiddle] = useState('');
    return (
        <div>
            <h1>Riddle</h1>
            <input type="text" onChange={(e)=>setRiddle(e.target.value)} value={riddle}/>
            <button onClick={()=>onRiddle(riddle)}>Send</button>
        </div>
    )
}