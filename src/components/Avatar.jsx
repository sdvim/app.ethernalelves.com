import PlaceholderElf from "../data/PlaceholderElf.svg";
import "./Avatar.scss";

export default function Avatar(props) {
  const isSelected = props.isSelected ? "Avatar--is-selected" : "";
  return (
    <div className={`Avatar ${isSelected}`} onClick={props.onClick}>
      <img className="Avatar__image" src={PlaceholderElf} alt="Avatar of Elf" />
      <div className="Avatar__level">Lv.{props.level}</div>
      <div className="Avatar__bar Avatar__health"></div>
      <div className="Avatar__bar Avatar__experience"></div>
    </div>
  );
}
