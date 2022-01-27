import "./Avatar.scss";

export default function Avatar(props) {
  const isSelected = props.isSelected ? "Avatar--is-selected" : "";
  return (
    <div className={`Avatar ${isSelected}`} onClick={props.onClick}>
      <img className="Avatar__image" src={props.image} alt="Avatar of Elf" />
      <div className="Avatar__level">Lv.{props.level}</div>
      { props.selectionIndex >= 0 &&
        <div className="Avatar__index">#{ props.selectionIndex + 1 }</div>
      }
      <div className="Avatar__bar Avatar__health"></div>
      <div className="Avatar__bar Avatar__experience"></div>
    </div>
  );
}
