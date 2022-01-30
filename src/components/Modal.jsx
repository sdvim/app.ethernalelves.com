import { useState } from "react";

import "./Modal.scss";

const stakingActions = [3, 4];

export default function Modal(props) {
  const [isActive, setIsActive] = useState(false);
  const isActiveClass = isActive ? "Modal__shim--is-active" : "";

  const actionsDOM = () => {
    const onClick = props.actionCallback;
    if (stakingActions.includes(props.character.action)) {
      return (
        <div className="Modal__actions">
          <button onClick={() => onClick({
            type: "SET_ELF_ACTION",
            key: "UNSTAKE",
            selection: [props.character.id],
          })}>Unstake</button>
        </div>
      );
    } else {
      const actions = [
        {
          buttonLabel: "Forge Item",
          key: "REROLL_ITEMS",
        },
        {
          buttonLabel: "Buy from Merchant",
          key: "REROLL_WEAPONS",
        },
        {
          buttonLabel: "Enter Campaign",
          key: "SEND_CAMPAIGN",
        },
        {
          buttonLabel: "Enter Passive",
          key: "SEND_PASSIVE",
        },
      ];
      return (
        <div className="Modal__actions">
          { actions.map((action) => {
            return (
              <button
                key={`action-${action.key}`}
                onClick={() => onClick({
                  type: "SET_ELF_ACTION",
                  key: action.key,
                  selection: [props.character.id],
                })}
              >
                { action.buttonLabel }
              </button>
            );
          }) }
        </div>
      );
    }
  };

  const handleClick = (e, boolean) => {
    e.stopPropagation();
    setIsActive(boolean);
  };

  return (
    <div className={`Modal__shim ${isActiveClass}`} onClick={(e) => handleClick(e, false)}>
      <div className="Modal" onClick={(e) => handleClick(e, true)}>
        <header className="Modal__header">
          <img className="Modal__image" src={props.character.image} alt="Character avatar" />
          <div className="Modal__summary">
            <h3 className="Modal__name">{props.character.name}</h3>
            <div className="Modal__bar Modal__health">HP</div>
            <div className="Modal__bar Modal__experience">XP</div>
          </div>
        </header>
        <h3>Stats</h3>
        <div className="Modal__stats">
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
