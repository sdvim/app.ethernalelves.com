import Account from "./pages/Account";
import Actions from "./pages/Actions";
import Connect from "./pages/Connect";
import Elves from "./pages/Elves";
import NotFound from "./pages/404";
import Help from "./pages/Help";
import { Modal } from "./components";
import "./App.scss";
import {
  useDispatch,
  useTrackedState,
} from "./Store";

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)}>&lt;</button>
  );
}

const RequireAuth = ({ children }) => {
  let location = useLocation();
  const state = useTrackedState();
  const { wallet } = state;

  if (!wallet) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/connect" state={{ from: location }} replace />;
  }

  return children;
}

const pages = [
  {
    path: "/",
    title: "Elves",
    element:
      <RequireAuth>
        <Elves />
      </RequireAuth>,
    isIndex: true,
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

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useTrackedState();
  const { isMoralisConnected } = state;
  const [currentPage, setCurrentPage] = useState(pages[0]);

  useEffect(() => {
    if (!isMoralisConnected) {
      dispatch({ type: "INITIALIZE_MORALIS" });
    }
  }, [isMoralisConnected, dispatch]);

  useEffect(() => {
    const matchedPage = pages.find((page) => page.path === location.pathname);
    setCurrentPage(matchedPage ? matchedPage : pages[pages.length - 1]);
    document.title = `${currentPage.title} - Ethernal Elves`;
  }, [currentPage, location]);

  return (
    <main className="App">
      {currentPage && (
        <Header
          title={currentPage.title}
          leftButton={currentPage.leftButton}
          rightButton={currentPage.rightButton}
        />
      )}
      <Routes location={location.state?.backgroundLocation || location}>
        { pages.map((page) => <Route
            path={page.path}
            element={page.element}
            index={page.isIndex}
            key={`page-${page.title}`}
          />)
        }
      </Routes>

      {location.state?.backgroundLocation && (
        <Routes>
          <Route path="/elf/:id" element={<Modal />} />
        </Routes>
      )}
    </main>
  );
}

const Header = (props) => {
  return (
    <header className="App__header">
      {
        props.leftButton
          ? props.leftButton
          : <button></button>
      }
      <h1>{ props.title }</h1>
      {
        props.rightButton
          ? props.rightButton
          : <button></button>
      }
    </header>
  );
};

export default App;
