import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from 'react-feather';
import { useTrackedState, useDispatch } from "../../Store";
import { pluralizeElves } from "../../Utils";

const ActionSelection = ({ availableActions }) => {
  const navigate = useNavigate();

  const onClick = (url) => navigate(url, { replace: true });

  return (
    <div className="ActionSelection">
      { availableActions?.map((action, index) => !action.hidden && (
        <button
          disabled={action.disabled}
          key={index}
          onClick={() => onClick(`/elves/${action.path}`)}
        >
          { action.image }
        </button>
      )) }
    </div>
  );
}

const ActionPagelet = ({ action: { text, cost } }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: { selection } } = useTrackedState();

  const onConfirm = () => {
    console.log("confirm");
  }

  const onBackClick = () => {
    dispatch({ type: "CLEAR_SELECTION" });
    navigate("/elves", { replace: true });
  }

  const elves = pluralizeElves(selection.length);

  const heading = text
    .replace("#ELVES", elves)
    .replace("#REN", selection.length * cost);

  return (
    <div className="ActionPagelet">
      <h4>{ heading }</h4>
      <div className="ActionPagelet__buttons">
        <button onClick={onBackClick}>
          <ChevronLeft />
        </button>
        <button onClick={onConfirm} disabled={!selection.length}>
          <Check />
        </button>
      </div>
    </div>
  )
}

export const ElvesActionPanel = ({ action, availableActions, hideActions }) => {
  const hidden = hideActions ? "ElvesActionPanel--hidden" : "";
  return (
    <div className={`ElvesActionPanel ${hidden}`}>
      { !action.hidden
        ? <ActionPagelet action={action} />
        : <ActionSelection availableActions={availableActions} />
      }
    </div>
  );
}