import { useTrackedState } from "../../Store";
import { actions, Elf } from "../../data";
import { useLocation } from "react-router-dom";

import { ElvesActionPanel } from "./ElvesActionPanel";
import { ElvesCollection } from "./ElvesCollection";
import { ElvesDetailsPanel } from "./ElvesDetailsPanel";
import { ElvesFilterPanel } from "./ElvesFilterPanel";
import { Award, Clock, Crosshair, Grid, List, Hash } from 'react-feather';
import { useMemo, useEffect, useRef, useState } from "react";
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
    attr: "weaponTier",
    value: "weaponTier",
    label: <Crosshair />,
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

  // const [nextElfToUpdate, setNextElfToUpdate] = useState(null);
  // const [nextUpdate, setNextUpdate] = useState(1000);
  const { user: { elfData, selection } } = useTrackedState();

  const elves = useMemo(() => elfData?.map((elfObject) => {
    const elf = new Elf(elfObject);
    elf.select(selection?.includes(elf.id));
    elf.sortBy(displayType.attr);
    // if (!nextElfToUpdate || (elf.isCoolingDown && elf.lastActionTimestamp < nextElfToUpdate.lastActionTimestamp)) {
    //   setNextElfToUpdate(elf);
    // }
    return elf;
  }), [displayType.attr, elfData, selection]);

  useEffect(() => {
    if (!pageEl || !filterEl) return;
    pageEl.current.scrollTop = filterEl.current.clientHeight;
  }, [location]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!nextElfToUpdate) {
  //       return;
  //     }
  //     if (nextElfToUpdate.cooldownSeconds < 2 * 60 * 60) {
  //       setNextUpdate(1000 + (Math.random() / 1000));
  //       return;
  //     }
  //     setNextUpdate((1000 * 60) + (Math.random() / 1000));
  //   }, nextUpdate);
  //   return () => clearInterval(interval);
  // }, [nextElfToUpdate, nextUpdate]);

  const action = useMemo(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentAction = actions.find(({ path }) => path === currentPath);
    return currentAction || actions[0];
  }, [location.pathname]);

  const sections = useMemo(() => {
    const { sections } = action;
    sections.forEach((section) => {
      section.elves = elves?.filter(section.filter);
      section.elves?.sort((a, b) => a.sort - b.sort);
    });
    return sections;
  }, [action, elves]);

  return (
    <div className="Elves page" ref={pageEl}>
      <div className="Elves__frame">
        <ElvesFilterPanel
          onDisplayTypeChange={setDisplayType}
          onViewTypeChange={setViewType}
          ref={filterEl}
        />
        <ElvesCollection
          viewType={viewType}
          displayType={displayType}
          sections={sections}
        />
        <ElvesDetailsPanel />
        <ElvesActionPanel
          action={action}
          sections={sections}
        />
      </div>
    </div>
  );
}
