import Account from "./Account";
import Connect from "./Connect";
import Elves from "./Elves/Elves";
import MenuPage from "./Menu";
import NotFound from "./404";

import { ChevronLeft, Menu, HelpCircle, RefreshCw } from 'react-feather';
import { useDispatch, useTrackedState } from "../Store";
import { actions } from "../data";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const BackButton = (props) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(props.to || -1)}>
      <ChevronLeft />
    </button>
  );
}

const InfoButton = () => {
  return (
    <a href="https://docs.ethernalelves.com" target="_blank" rel="noreferrer">
      <HelpCircle />
    </a>
  );
}

const ReloadButton = () => {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch({type: "LOAD_ELF_DATA" })}>
      <RefreshCw />
    </button>
  );
}

const MenuButton = () => {
  return (
    <Link to="/menu">
      <Menu />
    </Link>
  );
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
    isIndex: true,
    element: <Navigate to="elves" />
  },
  {
    path: "/elves",
    title: "Elves",
    element:
      <RequireAuth>
        <Elves />
      </RequireAuth>,
    leftButton: <MenuButton />,
    rightButton: <ReloadButton />,
  },
  ...actions.map((action) => ({
    path: `/elves/${action.path}`,
    title: action.label,
    leftButton: <InfoButton />,
    element:
      <RequireAuth>
        <Elves />
      </RequireAuth>,
  })),
  {
    path: "/account",
    title: "Account",
    element: 
      <RequireAuth>
        <Account />
      </RequireAuth>,
  },
  {
    path: "/connect",
    title: "Connect",
    element: <Connect />,
  },
  {
    path: "/menu",
    title: "Menu",
    element: 
      <RequireAuth>
        <MenuPage />
      </RequireAuth>,
    leftButton: <BackButton />,
  },
  {
    path: "/*",
    title: "404",
    leftButton: <BackButton />,
    element: <NotFound />,
  }
];