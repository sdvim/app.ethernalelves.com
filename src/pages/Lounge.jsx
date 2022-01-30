import React, { useMemo, useEffect } from "react";
import { Avatar } from "../components";
import {
  useDispatch,
  useTrackedState,
} from "../Store";
import {
  useNavigate,
} from "react-router-dom";


const actions = [
  {
    title: "Buy Items",
    buttonLabel: "Reroll",
    key: "REROLL_ITEMS",
    description: "Take a chance and pay 0.05 ETH to reroll your items.",
  },
  {
    title: "Forge Weapons",
    buttonLabel: "Reroll",
    key: "REROLL_WEAPONS",
    description: "Take a chance and pay 0.05 ETH to reroll your weapons.",
  },
  {
    title: "Passive",
    buttonLabel: "Stake",
    key: "SEND_PASSIVE",
    description: "Earn a passive yield of $REN.",
  },
  {
    title: "Campaign",
    buttonLabel: "Enter",
    key: "SEND_CAMPAIGN",
    description: "Select a campaign mode and possibly win $REN at the risk of your elves losing health to hostile creatures.",
  },
];

export default function Lounge() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useTrackedState();

  useEffect(() => {
    if (state.selection.length <= 0) navigate("/");
  }, [state, navigate]);

  const elvesDOM = useMemo(() => {
    return state.selection.map((id) => {
      const elf = state.elves.find((elf) => elf.id === id);
      return <Avatar
        image={elf.image}
        display={`#${elf.id}`}
        hideBars={true}
        key={`avatar-${elf.id}`}
      />;
    });
  }, [state]);

  const actionsDOM = actions.map((action) => {
    const onClick = () => {
      dispatch({ type: "SET_ELF_ACTION", key: action.key });
      navigate("/");
    }
    return (
      <React.Fragment key={action.key}>
        <hr key={`${action.key}-hr`} />
        <header key={`${action.key}-header`} className="tmp-flex">
          <h2>
            { action.title }
          </h2>
          <button onClick={onClick}>
            { action.buttonLabel }
          </button>
        </header>
        <p key={`${action.key}-description`}>{ action.description }</p>
      </React.Fragment>
    );
  });

  return (
    <div className="Lounge page">
      <h1>Elven Lounge</h1>
      <button onClick={() => navigate(-1)}>Back</button>
      <br />
      <br />
      <div className="tmp-grid">
        { elvesDOM }
      </div>
      <br />
      <div>
        { actionsDOM }
      </div>
    </div>
  );
}