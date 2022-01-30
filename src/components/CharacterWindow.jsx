import { useState } from "react";

import "./CharacterWindow.scss";

const stakingActions = [3, 4];

export default function CharacterWindow(props) {
  const [isActive, setIsActive] = useState(false);
  const isActiveClass = isActive ? "CharacterWindow__shim--is-active" : "";

  const actionsDOM = () => {
    const onClick = props.actionCallback;
    if (stakingActions.includes(props.character.action)) {
      return (
        <div className="CharacterWindow__actions">
          <button onClick={() => onClick({
            type: "UNSTAKE_ELVES",
            selection: [props.character.id],
          })}>Unstake</button>
        </div>
      );
    } else {
      return (
        <div className="CharacterWindow__actions">
          <button>Forge Item</button>
          <button>Buy from Merchant</button>
          <button>Enter Campaign</button>
          <button>Enter Passive</button>
          <button disabled={true}>Bloodthirst</button>
        </div>
      );
    }
  };

  const handleClick = (e, boolean) => {
    e.stopPropagation();
    setIsActive(boolean);
  };

  return (
    <div className={`CharacterWindow__shim ${isActiveClass}`} onClick={(e) => handleClick(e, false)}>
      <div className="CharacterWindow" onClick={(e) => handleClick(e, true)}>
        <header className="CharacterWindow__header">
          <img className="CharacterWindow__image" src={props.character.image} alt="Character avatar" />
          <div className="CharacterWindow__summary">
            <h3 className="CharacterWindow__name">{props.character.name}</h3>
            <div className="CharacterWindow__bar CharacterWindow__health">HP</div>
            <div className="CharacterWindow__bar CharacterWindow__experience">XP</div>
          </div>
        </header>
        <h3>Stats</h3>
        <div className="CharacterWindow__stats">
          <span>CLASS:</span>
          <span>ASSASSIN</span>
          <span>RACE:</span>
          <span>DARKBORNE</span>
          <span>HEAD:</span>
          <span>SHORT</span>
          <span>WEAPON:</span>
          <span>DISCIPLE STAFF +3</span>
          <span>WEAPON TIER:</span>
          <span>0</span>
          <span>ACCESSORY:</span>
          <span>PIRATE HOOK +1</span>
          <span>LEVEL:</span>
          <span>16</span>
          <span>ATTACK POINTS:</span>
          <span>4</span>
          <span>HEALTH POINTS:</span>
          <span>23</span>
        </div>
        <h3>Actions</h3>
        { actionsDOM() }
      </div>
    </div>
  );
}
