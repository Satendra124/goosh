import { useState } from "react"
import '../styles.css'
import { BlobButton } from "../common/BlobButton";


export const Riddle = ({onRiddle,opponent}) => {
    const [riddle,setRiddle] = useState('');
    return (
        <div className="input-riddle-wrapper">
            <h3>Give me a word to create a riddle for them</h3>
            <h5>{opponent?"You got a riddle":null}</h5>
            <input type="text" onChange={(e)=>setRiddle(e.target.value)} value={riddle}/>
            <BlobButton onClick={()=>onRiddle(riddle)} text={"Send"}/>
        </div>
    )
}