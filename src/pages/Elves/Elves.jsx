import { ElvesActionPanel } from "./ElvesActionPanel";
import { ElvesCollection } from "./ElvesCollection";
import { ElvesDetailsPanel } from "./ElvesDetailsPanel";
import { ElvesFilterPanel } from "./ElvesFilterPanel";
import { useState } from "react";
import "./Elves.scss";

export const displayTypes = [
  {
    attr: "lastActionTimestamp",
    value: "lastActionTimestamp",
    label: "Time",
  },
  {
    attr: "statLevel",
    value: "statLevel",
    label: "Level",
  },
  {
    attr: "id",
    value: "id",
    label: "ID",
  },
];

export const viewTypes = [
  {
    view: "grid",
    value: "grid",
    label: "Grid",
  },
  {
    view: "list",
    value: "list",
    label: "List",
  },
];



export default function Elves() {
  const [displayType, setDisplayType] = useState(displayTypes[0]);
  const [viewType, setViewType] = useState(viewTypes[0]);

  return (
    <div className="Elves page">
      <ElvesFilterPanel
        onDisplayTypeChange={setDisplayType}
        onViewTypeChange={setViewType}
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
