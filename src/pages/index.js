import Account from "./Account";
import Actions from "./Actions";
import Connect from "./Connect";
import Elves from "./Elves";
import Help from "./Help";
import Menu from "./Menu";
import NotFound from "./404";

import { useTrackedState } from "../Store";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>&lt;</button>
  );
}

const MenuButton = () => {
  return (
    <Link to="/menu">Menu</Link>
  )
}

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const state = useTrackedState();
  const { address } = state.user;

  if (!address) {
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
    leftButton: <MenuButton />,
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
    path: "/menu",
    title: "Menu",
    element: 
      <RequireAuth>
        <Menu />
      </RequireAuth>,
    leftButton: <BackButton />,
  },
  {
    path: "*",
    title: "404",
    leftButton: <BackButton />,
    element: <NotFound />,
  }
];