import React, { useMemo, useEffect } from "react";
import { Avatar } from "../components";
import {
  useTrackedState,
} from "../Store";
import {
  useNavigate,
  Link,
} from "react-router-dom";

export default function Actions() {
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

  return (
    <div className="Actions page">
      <div className="tmp-grid">
        { elvesDOM }
      </div>
      <br />
      <div className="tmp-frame">
        <h2>Elven Lounge</h2>
        <p>Your elves can quickly gear up for their next adventure, instantly drawing new weapons and items.</p>
        <Link className="button" to="/actions/forge">Blacksmith</Link>
        <Link className="button" to="/actions/purchase">Merchant</Link>
      </div>
      <div className="tmp-frame" style={{ marginTop: "3em" }}>
        <h2>Game Modes</h2>
        <p>Send out your elves to do ongoing tasks, earning $REN, leveling up, and possibly finding new weapons and items along the way.</p>
        <Link className="button" to="/actions/passive">Passive</Link>
        <Link className="button" to="/actions/campaign">Campaign</Link>
        <button disabled>Blood Thirst</button>
      </div>
    </div>
  );
}