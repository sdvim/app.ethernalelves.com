import { actions } from "../../data";
import { NavLink } from "react-router-dom";

export function ElvesActionPanel() {
  return (
    <div className="ElvesActionPanel">
      { actions.map((action, index) => {
        return !action.hidden && (
          <NavLink replace={true} key={index} to={`/elves/${action.path}`}>
            <button style={{ backgroundImage: `url(${action.image})` }} />
          </NavLink>
        );
      }) }
    </div>
  );
}