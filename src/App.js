import Balance from "./pages/Balance";
import Home from "./pages/Home";
import Help from "./pages/Help";
import Profile from "./pages/Profile";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import './App.scss';

function App() {
  return (
    <Router className="App">
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/balance" element={<Balance />} />
        <Route path="/help" element={<Help />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/balance">Miren</NavLink>
        <NavLink to="/help">Help</NavLink>
      </nav>
    </Router>
  );
}

export default App;
