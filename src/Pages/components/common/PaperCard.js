import './PaperCard.css';

export const PaperCard = ({ children, className }) => (
    <div className= {"paper-card-wrapper "+className}>
    <div className="paper pink">
      <div className="tape-section"></div>
      <p>{children}</p>
      <div className="tape-section"></div>
    </div>
  </div>
);