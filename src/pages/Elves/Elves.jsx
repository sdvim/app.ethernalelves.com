import { ElvesActionPanel } from "./ElvesActionPanel";
import { ElvesCollection } from "./ElvesCollection";
import { ElvesDetailsPanel } from "./ElvesDetailsPanel";
import { ElvesFilterPanel } from "./ElvesFilterPanel";
import { useState } from "react";
import "./Elves.scss";

export const displayTypes = [
  {
    attr: "lastActionTimestamp",
    label: "Time",
  },
  {
    attr: "statLevel",
    label: "Level",
  },
  {
    attr: "id",
    label: "ID",
  },
];

export const viewTypes = [
  {
    view: "grid",
    label: "Grid",
  },
  {
    view: "list",
    label: "List",
  },
];



export default function Elves() {
  const [displayType, setDisplayType] = useState(displayTypes[0]);
  const [viewType, setViewType] = useState(viewTypes[0]);

  const onDisplayTypeChange = (e) => {
    const newDisplayType = displayTypes.find(
      (type) => type.attr === e.target.value
    );
    setDisplayType(newDisplayType);
  };

  const onViewTypeChange = (e) => {
    const newViewType = viewTypes.find(
      (type) => type.view === e.target.value
    );
    setViewType(newViewType);
  };

  return (
    <div className="Elves page">
      <ElvesFilterPanel
        viewType={viewType}
        displayType={displayType}
        onDisplayTypeChange={onDisplayTypeChange}
        onViewTypeChange={onViewTypeChange}
      />
      <ElvesCollection
        viewType={viewType}
        displayType={displayType}
      />
      <ElvesDetailsPanel />
      <ElvesActionPanel />
    </div>
  );
}
