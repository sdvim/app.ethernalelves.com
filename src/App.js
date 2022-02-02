import Account from "./pages/Account";
import Lounge from "./pages/Lounge";
import Elves from "./pages/Elves";
import Help from "./pages/Help";
import { Provider } from "./Store";
import { Modal } from "./components";

import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)}>Back</button>
  );
}

const pages = [
  {
    path: "/",
    title: "Elves",
    element: <Elves />,
    isIndex: true,
  },
  {
    path: "/account",
    title: "Account",
    element: <Account />,
  },
  {
    path: "/lounge",
    title: "Actions",
    leftButton: <BackButton />,
    element: <Lounge />,
  },
  {
    path: "/help",
    title: "Help",
    element: <Help />,
  },
];

const App = () => {
  let location = useLocation();
  let state = location.state;
  let [currentPage, setCurrentPage] = useState(pages[0]);

  useEffect(() => {
    setCurrentPage(pages.find((page) => page.path === location.pathname));
    document.title = `${currentPage.title} - Ethernal Elves`;
  }, [currentPage, location]);

  return (
    <Provider>
      {currentPage && (
        <Header
          title={currentPage.title}
          leftButton={currentPage.leftButton}
          rightButton={currentPage.rightButton}
        />
      )}
      <Routes location={state?.backgroundLocation || location}>
        { pages.map((page) => <Route
            path={page.path}
            element={page.element}
            index={page.isIndex}
            key={`page-${page.title}`}
          />)
        }
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route path="/elf/:id" element={<Modal />} />
        </Routes>
      )}
      <Nav />
    </Provider>
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

const Nav = () => {
  return (
    <nav>
      <NavLink to="/">Elves</NavLink>
      <NavLink to="/account">Account</NavLink>
      <NavLink to="/help">Help</NavLink>
    </nav>
  );
}

export default App;
