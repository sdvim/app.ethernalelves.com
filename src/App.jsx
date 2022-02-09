import { Modal } from "./components";
import { useDispatch, useTrackedState } from "./Store";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { pages } from "./pages";
import "./App.scss";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useTrackedState();
  const { errors, isMoralisConnected } = state;
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

      <div className="errors">
        { errors?.map((error) => (
          <div>{ error }</div>
        )) }
      </div>
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
