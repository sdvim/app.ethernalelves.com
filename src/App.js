import Elves from "./pages/Elves";
import Help from "./pages/Help";
import Account from "./pages/Account";
import { Provider } from "./Store";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

const App = () => {
  return (
    <Provider>
      <Router className="App">
        <Routes>
          <Route path="/account" element={<Account />} />
          <Route path="/help" element={<Help />} />
          <Route path="/" element={<Elves />} />
        </Routes>
        <Nav />
      </Router>
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
