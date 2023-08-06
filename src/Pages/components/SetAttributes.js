import { useState } from "react";
import { PaperCard } from "./common/PaperCard";
import '../styles.css';

export const SetAttributes = ({onAttrSet}) => {
    const [attributes,setAttributes] = useState([]);
    const [attribute,setAttribute] = useState("");

    const onSetAttributeEnter = (e) => {
        if(e.key === 'Enter'){
            if(attributes.length < 2){
                setAttributes([...attributes,attribute]);
                setAttribute("");
            }else{
                // start game
                onAttrSet(attributes);
            }
        }
    }
    const onSetAttribute = (e) => {
        if(attributes.length < 2){
            setAttributes([...attributes,attribute]);
            setAttribute("");
        }else{
            // start game
            onAttrSet(attributes);
        }
    }
    return (
        <div className="set-attributes-wrapper">
            <PaperCard className="paper-card">
                <div className="attributes">
                    Add Attributes like Love, Health, or anything comes to your mind.
                    {
                        attributes.map((attribute,index) => (
                            <div className="attribute-item" key={index}>
                                {attribute}
                            </div>
                        ))
                    }
                </div>
                {
                    attributes.length < 2 &&
                    <input type="text" maxLength={10} placeholder="Enter attribute" className="attribute-input" value={attribute} onChange={(e)=>setAttribute(e.target.value)} onKeyDown={onSetAttributeEnter}/>
                }
                <button className="add-attribute-button" onClick={onSetAttribute}>{
                    attributes.length === 2 ? "Start Game" : "Add"
                }</button>
            </PaperCard>
        </div>
    );
}