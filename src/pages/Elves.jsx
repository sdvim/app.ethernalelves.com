import React, { useState, useMemo } from "react";
import { Avatar } from "../components";
import { timestampToTimeString, timestampToHealthPercentage } from "../Utils";
import { useDispatch, useTrackedState } from "../Store";

const displayTypes = [
  {
    attr: "timestamp",
    label: "Time",
    avatarDisplay: (timestamp) => timestampToTimeString(timestamp),
  },
  {
    attr: "level",
    label: "Level",
    avatarDisplay: (level) => `Lv. ${level}`,
  },
  {
    attr: "id",
    label: "ID",
    avatarDisplay: (id) => `#${id}`,
  },
];

const viewTypes = [
  {
    view: "grid",
    label: "Grid",
  },
  {
    view: "list",
    label: "List",
  },
];

export default function Home() {
  const [displayType, setDisplayType] = useState(displayTypes[0]);
  const [viewType, setViewType] = useState(viewTypes[0]);
  const dispatch = useDispatch();
  const state = useTrackedState();
  const { elves, selection } = state.user;

  const sections = useMemo(() => {
    const collections = [
      {
        title: "Idle",
        elves: [],
      },
      {
        title: "Active",
        elves: [],
      },
      {
        title: "Passive",
        elves: [],
      },
      {
        title: "Bridged (Polygon)",
        elves: [],
      },
    ];

    elves.forEach((elf) => {
      elf.isSelected = selection?.includes(elf.id);
      elf.sort = elf[displayType.attr];
      switch (elf.action) {
        case 8:
          collections[3].elves.push(elf);
          break;
        case 3:
          collections[2].elves.push(elf);
          break;
        default:
          let isCoolingDown = elf.timestamp > +new Date() / 1000;
          collections[isCoolingDown ? 1 : 0].elves.push(elf);
          break;
      }
    });

    collections.forEach((collection) => {
      collection.elves.sort((a, b) => a.sort - b.sort);
    });

    return collections;
  }, [displayType, elves, selection]);

  const sectionsDOM = useMemo(() => sections.map((section, sectionIndex) => {
    return (section.elves.length > 0) && (
      <React.Fragment key={sectionIndex}>
        <div className="tmp-flex">
          <h2 key={`${section.title}`}>
            { section.title }:{ " " }
            { section.elves.length }
          </h2>
          { section.action &&
            <button onClick={section.onClick} disabled={section.isDisabled}>
              {section.action}
            </button>
          }
        </div>
        <div key={`${sectionIndex}-view`} className={`tmp-${viewType.view}`}>
          {
            section.elves.map((elf, index) => {
              return (viewType.view === "grid")
                ? <Avatar
                    key={`${sectionIndex}-${index}`}
                    image={elf.image}
                    isSelected={elf.isSelected}
                    display={displayType.avatarDisplay(elf[displayType.attr])}
                    healthPercentage={timestampToHealthPercentage(elf.timestamp)}
                    hideBars={elf.action === 3}
                    onClick={() => elf.action !== 8 && dispatch({
                      type: "UPDATE_SELECTION",
                      id: elf.id,
                      sectionId: sectionIndex,
                    })}
                  />
                : (
                  <div
                    className="tmp-avatar-list-item"
                    key={`${sectionIndex}-${index}`}
                    onClick={() => elf.action !== 8 && dispatch({
                      type: "UPDATE_SELECTION",
                      id: elf.id,
                      sectionId: sectionIndex,
                    })}
                  >
                    <Avatar
                      image={elf.image}
                      isSelected={elf.isSelected}
                      healthPercentage={timestampToHealthPercentage(elf.timestamp)}
                      hideBars={elf.action === 3}
                    />
                    <span>{ displayTypes[2].avatarDisplay(elf.id) }</span>
                    <span>{ displayTypes[1].avatarDisplay(elf.level) }</span>
                    <span>{ displayTypes[0].avatarDisplay(elf.timestamp) }</span>
                  </div>
                );
            })
          }
        </div>
      </React.Fragment>
    );
  }), [dispatch, displayType, sections, viewType.view]);

  const handleDisplayTypeChange = (e) => {
    const newDisplayType = displayTypes.find(
      (type) => type.attr === e.target.value
    );
    setDisplayType(newDisplayType);
  };

  const handleViewTypeChange = (e) => {
    const newViewType = viewTypes.find(
      (type) => type.view === e.target.value
    );
    setViewType(newViewType);
  };

  return (
    <div className="Home page">
      <form>
        { displayTypes.map(({ attr, label }) => 
          <label key={`displayType-${attr}`}>
            <input
              type="radio"
              name="display"
              value={attr}
              checked={displayType.attr === attr}
              onChange={handleDisplayTypeChange}
            />
            <span>{ label }</span>
          </label>
        )}
      </form>
      <form>
        { viewTypes.map(({ view, label }) => 
          <label key={`viewType-${view}`}>
            <input
              type="radio"
              name="view"
              value={view}
              checked={viewType.view === view}
              onChange={handleViewTypeChange}
            />
            <span>{ label }</span>
          </label>
        )}
      </form>
      { sectionsDOM }
    </div>
  );
}
