import "./Avatar.scss";

export default function Avatar(props) {
  const isSelected = props.isSelected ? "Avatar--is-selected" : "";
  const degrees = 360 * (1 - (props.healthPercentage / 100));
  const background = `conic-gradient(from 180deg, black ${degrees}deg, transparent 0)`;
  return (
    <div className={`Avatar ${isSelected}`} onClick={props.onClick}>
      <img className="Avatar__image" src={props.image} alt="Avatar of Elf" />
      <div className="Avatar__cooldown" style={{ background }}></div>
      <div className="Avatar__display mono">{props.display}</div>
      { props.selectionIndex >= 0 &&
        <div className="Avatar__index">#{ props.selectionIndex + 1 }</div>
      }
      {/* { !props.hideBars &&
        <div className="Avatar__bar Avatar__health">
          <div
            className="Avatar__health--inner"
            style={{ width: `${props.healthPercentage}%` }}
          ></div>
        </div>
      } */}
    </div>
  );
}
