import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from 'react-feather';

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

export const ElvesActionPanel = ({ action, availableActions }) => {
  return (
    <div className="ElvesActionPanel">
      { !action.hidden
        ? <ActionPagelet text={action.text} />
        : <ActionSelection availableActions={availableActions} />
      }
    </div>
  );
}