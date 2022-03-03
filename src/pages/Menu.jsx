import { Link } from "react-router-dom";
import { useDispatch } from "../Store";

export default function Menu() { 

  const dispatch = useDispatch();

  return (
    <div className="NotFound page">
      <button>
        Switch to Etherum
      </button>
      <br />
      <br />
      <button onClick={() => dispatch({type: "DISCONNECT_WALLET"})}>
        Disconnect wallet
      </button>
    </div>
  );
}
