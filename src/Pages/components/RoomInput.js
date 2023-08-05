import './RoomInput.css'

export const RoomInput = ({value,setValue,placeholder})=>{
    return (
        <input type="text" onChange={(e)=>setValue(e.target.value)} placeholder={placeholder} className='roomInput'value={value} maxLength={7}/>
    )
}