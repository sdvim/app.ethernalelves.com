import { actions } from "../../data";
import { Link } from "react-router-dom";

export function ElvesActionPanel() {
  return (
    <div className="ElvesActionPanel">
      { actions.map((action, index) => {
        return !action.hidden && (
          <Link replace={true} key={index} to={`/elves/${action.path}`}>{ action.label }</Link>
        );
      }) }
    </div>
  );
}