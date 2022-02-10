import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useTrackedState } from "../Store";

export default function Connect() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = useTrackedState();
  const { address } = state.user;
  const from = location.state?.from?.pathname || "/";

  const walletName = window.ethereum?.isMetaMask
    ? "MetaMask"
    : "Wallet Connect";
  
  useEffect(() => {
    if (address) navigate(from, { replace: true });
  }, [address, from, navigate]);

  return (
    <div className="Connect page page--centered">
      <p>Please login.</p>
      <button onClick={() => dispatch({ type: "CONNECT_WALLET" })}>
        Connect with {walletName}
      </button>
    </div>
  );
}
