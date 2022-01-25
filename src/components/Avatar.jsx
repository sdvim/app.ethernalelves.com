import elfImageData from "../assets/placeholders.jsx";
import "./Avatar.scss";

export default function Home() {
  return (
    <div className="Avatar">
      <img className="Avatar__image" src={elfImageData} />
      <div className="Avatar__bar Avatar__health"></div>
      <div className="Avatar__bar Avatar__experience"></div>
    </div>
  );
}
