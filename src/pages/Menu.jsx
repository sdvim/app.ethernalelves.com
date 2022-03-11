import { useDispatch, useTrackedState } from "../Store";

export default function Menu() {
  const state = useTrackedState();
  const dispatch = useDispatch();

  const chainLabel = state.chain !== "eth" ? "Ethereum" : "Polygon";

  return (
    <div className="NotFound page">
      <button key={1} onClick={() => dispatch({type: "TOGGLE_CHAIN" })}>
        Switch to { chainLabel }
      </button>
      <br />
      <br />
      <button key={2} onClick={() => dispatch({type: "DISCONNECT_WALLET" })}>
        Disconnect wallet
      </button>
    </div>
  );
}
