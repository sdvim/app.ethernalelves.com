import Account from "./Account";
import Actions from "./Actions";
import Connect from "./Connect";
import Elves from "./Elves";
import NotFound from "./404";
import Help from "./Help";

import { useDispatch, useTrackedState } from "../Store";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>&lt;</button>
  );
}

const LogoutButton = () => {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch({type: "DISCONNECT_WALLET"})}>X</button>
  );
};

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const state = useTrackedState();
  const { wallet } = state.user;

  if (!wallet) {
    return <Navigate to="/connect" state={{ from: location }} replace />;
  }

  return children;
}

export const pages = [
  {
    path: "/",
    title: "Elves",
    element:
      <RequireAuth>
        <Elves />
      </RequireAuth>,
    isIndex: true,
    leftButton: <LogoutButton />,
  },
  {
    path: "/account",
    title: "Account",
    element: 
      <RequireAuth>
        <Account />
      </RequireAuth>,
  },
  {
    path: "/actions",
    title: "Actions",
    leftButton: <BackButton />,
    element: <Actions />,
  },
  {
    path: "/connect",
    title: "Connect",
    element: <Connect />,
  },
  {
    path: "/help",
    title: "Help",
    element: <Help />,
  },
  {
    path: "*",
    title: "404",
    leftButton: <BackButton />,
    element: <NotFound />,
  }
];