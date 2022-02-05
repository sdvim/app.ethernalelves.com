import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useTrackedState } from "../Store";

export default function Connect() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = useTrackedState();
  const { wallet } = state.user;
  const from = location.state?.from?.pathname || "/";
  
  useEffect(() => {
    if (wallet) navigate(from, { replace: true });
  }, [wallet, from, navigate]);

  return (
    <div className="Connect page">
      <p>Please login.</p>
      <button onClick={() => dispatch({ type: "CONNECT_WALLET" })}>
        Connect Wallet
      </button>
    </div>
  );
}
