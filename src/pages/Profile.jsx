import { useSetState, useTrackedState } from "../Store";

const INCREASE_AMOUNT = 15;
const DECREASE_AMOUNT = 100;

export default function Help() {
  const setState = useSetState();
  const state = useTrackedState();
  const balanceLabel = `${state.ren} $REN`;
  const increaseRen = () => {
    const ren = state.ren + INCREASE_AMOUNT;
    setState((prev) => ({ ...prev, ren }));
  }
  const decreaseRen = () => {
    const ren = state.ren - DECREASE_AMOUNT;
    setState((prev) => ({ ...prev, ren }));
  }
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
