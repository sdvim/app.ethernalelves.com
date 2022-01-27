import { useDispatch, useTrackedState } from "../Store";

const INCREASE_AMOUNT = 15;
const DECREASE_AMOUNT = 100;

export default function Help() {
  const dispatch = useDispatch();
  const state = useTrackedState();
  const balanceLabel = `${state.ren} $REN`;
  const increaseRen = () => dispatch({
    type: "UPDATE_REN",
    value: INCREASE_AMOUNT,
  });
  const decreaseRen = () => dispatch({
    type: "UPDATE_REN",
    value: -DECREASE_AMOUNT,
  });
  const decreaseButtonDisabled = state.ren < DECREASE_AMOUNT;

  return (
    <div className="Help page">
      <h1>Profile</h1>
      <button onClick={increaseRen}>+{ INCREASE_AMOUNT } $REN</button>
      <br />
      <br />
      <button onClick={decreaseRen} disabled={decreaseButtonDisabled}>
        -{ DECREASE_AMOUNT } $REN
      </button>
      <p>Balance: { balanceLabel }</p>
    </div>
  );
}
