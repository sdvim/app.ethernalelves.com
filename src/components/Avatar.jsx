import "./Avatar.scss";

export default function Avatar({
  isSelectable,
  isSelected,
  healthPercentage,
  onClick,
  image,
  display,
  passiveProgress,
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
      { passiveProgress &&
        <div className={`Avatar__bar Avatar__passive Avatar__passive--tier-${passiveProgress.tier}`}>
          <div
            className="Avatar__passive--inner"
            style={{ width: `${passiveProgress.percentage}%` }}
          ></div>
        </div>
      }
    </div>
  );
}
