import elfImageData from "../assets/placeholders.jsx";
import "./Avatar.scss";

export default function Home() {
  return (
    <div className="Avatar">
      <img className="Avatar__image" src={elfImageData} alt="Avatar of Elf" />
      <div className="Avatar__level">Lv.10</div>
      <div className="Avatar__bar Avatar__health"></div>
      <div className="Avatar__bar Avatar__experience"></div>
    </div>
  );
}
