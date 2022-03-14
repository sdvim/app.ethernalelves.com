import { ElvesActionPanel } from "./ElvesActionPanel";
import { ElvesCollection } from "./ElvesCollection";
import { ElvesDetailsPanel } from "./ElvesDetailsPanel";
import { ElvesFilterPanel } from "./ElvesFilterPanel";
import { Award, Clock, Grid, List, Hash } from 'react-feather';
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Elves.scss";

export const displayTypes = [
  {
    attr: "lastActionTimestamp",
    value: "lastActionTimestamp",
    label: <Clock />,
  },
  {
    attr: "statLevel",
    value: "statLevel",
    label: <Award />,
  },
  {
    attr: "id",
    value: "id",
    label: <Hash />,
  },
];

export const viewTypes = [
  {
    view: "grid",
    value: "grid",
    label: <Grid />,
  },
  {
    view: "list",
    value: "list",
    label: <List />,
  },
];



export default function Elves() {
  const [displayType, setDisplayType] = useState(displayTypes[0]);
  const [viewType, setViewType] = useState(viewTypes[0]);
  const pageEl = useRef(null);
  const filterEl = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!pageEl || !filterEl) return;
    pageEl.current.scrollTop = filterEl.current.clientHeight;
  }, [location]);

  const minHeight =() => {
    let filterHeight = filterEl.current?.clientHeight || 0;
    return `calc(100vh + ${filterHeight}px)`;
  };

  return (
    <div className="Elves page" ref={pageEl}>
      <div style={{ minHeight }}>
        <ElvesFilterPanel
          onDisplayTypeChange={setDisplayType}
          onViewTypeChange={setViewType}
          ref={filterEl}
        />
        <ElvesCollection
          viewType={viewType}
          displayType={displayType}
        />
        <ElvesDetailsPanel />
        <ElvesActionPanel />
      </div>
    </div>
  );
}
