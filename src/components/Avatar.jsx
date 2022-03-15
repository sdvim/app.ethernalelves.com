import "./Avatar.scss";

export default function Avatar({
  isSelectable,
  isSelected,
  healthPercentage,
  onClick,
  image,
  display,
  selectionIndex,
}) {
  const selectable = isSelectable ? "Avatar--selectable" : "";
  const selected = isSelected ? "Avatar--selected" : "";
  const degrees = 360 * (1 - (healthPercentage / 100));
  const style = { "--degrees": `${degrees}deg`};
  return (
    <div className={`Avatar ${selectable} ${selected}`} onClick={onClick}>
      <img className="Avatar__image" src={image} alt="Avatar of Elf" />
      <div className="Avatar__cooldown" style={style}></div>
      <div className="Avatar__display mono">{display}</div>
      { selectionIndex >= 0 &&
        <div className="Avatar__index">#{ selectionIndex + 1 }</div>
      }
      {/* { !hideBars &&
        <div className="Avatar__bar Avatar__health">
          <div
            className="Avatar__health--inner"
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
      } */}
    </div>
  );
}
