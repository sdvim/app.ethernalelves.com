import Elves from "./pages/Elves";
import Help from "./pages/Help";
import Account from "./pages/Account";
import { Provider } from "./Store";
import { Modal } from "./components";

import {
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";

const App = () => {
  let location = useLocation();
  let state = location.state;

  return (
    <Provider>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Elves />} index />
        <Route path="/account" element={<Account />} />
        <Route path="/help" element={<Help />} />
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
