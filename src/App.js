import Home from "./pages/Home";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import { Provider, useSetState, useTrackedState } from "./Store";

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/" element={<Home />} />
        </Routes>
        <Nav />
      </Router>
    </Provider>
  );
}

const Nav = () => {
  const setState = useSetState();
  const state = useTrackedState();
  const profileLabel = `${state.ren} $REN`;

  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/profile">{ profileLabel }</NavLink>
      <NavLink to="/help">Help</NavLink>
    </nav>
  );
}

export default App;
