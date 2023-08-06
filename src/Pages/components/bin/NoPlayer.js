export const NoPlayer = ({room}) => {
    return (
        <div className="no-player text">
            <h3>Share the url to opponent for them to join</h3>
            <div className="link-box">
                <span>https://www.satendra.live/{room}</span>
            </div>
        </div>
    )
}