export const Result = ({won,onNext})=>{
    return(
        <div className="result">
            <h1>{won ? "You Won" : "You Lost"}</h1>
            <button onClick={onNext}>Next Round</button>
        </div>
    )
}