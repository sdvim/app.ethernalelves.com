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

  const { user: { elfData } } = useTrackedState();

  useEffect(() => {
    if (!pageEl || !filterEl) return;
    pageEl.current.scrollTop = filterEl.current.clientHeight;
  }, [location]);

  const elves = useMemo(() =>
    elfData?.map((elfObject) => new Elf(elfObject)
  ), [elfData]);

  const action = useMemo(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentAction = actions.find(({ path }) => path === currentPath);
    return currentAction || actions[0];
  }, [location.pathname]);

  const availableActions = useMemo(() => {
    return actions.map((action) => {
      let elvesCount = 0;
      let disabled = false;
      
      action.sections.every(({ filter, required }) => {
        let possibleElves = [...elves.filter(filter)].length;
        elvesCount += possibleElves;
        if (!possibleElves && required) {
          disabled = true;
          return false;
        }
        if (elvesCount) return false;
        return true;
      });

      action.disabled = disabled;
      return action;
    });
  }, [elves]);

  const sections = useMemo(() => {
    const { sections } = action;
    sections.forEach((section) => {
      section.elves = elves?.filter(section.filter);
      section.elves?.forEach((elf) => {
        elf.sortBy(displayType.attr);
      })
      section.elves?.sort((a, b) => a.sort - b.sort);
    });
    return sections;
  }, [action, displayType.attr, elves]);

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
          availableActions={availableActions}
        />
      </div>
    </div>
  );
}
