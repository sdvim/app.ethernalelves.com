import { actions } from "../../data";
import { useNavigate, NavLink } from "react-router-dom";
import { ChevronLeft, Check } from 'react-feather';

const ActionSelection = () => {
  return (
    <div className="ActionSelection">
      { actions.map((action, index) => !action.hidden && (
        <NavLink replace={true} key={index} to={`/elves/${action.path}`}>
          <button>
            { action.image }
          </button>
        </NavLink>
      )) }
    </div>
  );
}

const ActionPagelet = ({ text }) => {
  const navigate = useNavigate();

  const onConfirm = () => {
    console.log("confirm");
  }

  const onBackClick = () => {
    navigate("/elves", { replace: true });
  }

  return (
    <div className="ActionPagelet">
      <h4>{ text }</h4>
      <div className="ActionPagelet__buttons">
        <button onClick={onBackClick}>
          <ChevronLeft />
        </button>
        <button onClick={onConfirm}>
          <Check />
        </button>
      </div>
    </div>
  )
}

export const ElvesActionPanel = ({ action }) => {
  return (
    <div className="ElvesActionPanel">
      { !action.hidden
        ? <ActionPagelet text={action.text} />
        : <ActionSelection />
      }
    </div>
  );
}