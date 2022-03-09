import React, { useState, useMemo, useEffect } from "react";
import { Avatar } from "../components";
import { useDispatch, useTrackedState } from "../Store";
import { actions, Elf } from "../data";
import { Link, useLocation } from "react-router-dom";

const displayTypes = [
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

export function ElvesDetailsPanel() {
  return (
    <div className="ElvesDetailsPanel">
    </div>
  );
}

export function ElvesActions() {
  return (
    <div className="ElvesActions">
      { actions.map((action, index) => {
        return !action.hidden && (
          <Link replace={true} key={index} to={`/elves/${action.path}`}>{ action.label }</Link>
        );
      }) }
    </div>
  );
}

export default function Home() {
  const [displayType, setDisplayType] = useState(displayTypes[0]);
  const [viewType, setViewType] = useState(viewTypes[0]);
  const [nextElfToUpdate, setNextElfToUpdate] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(1000);
  const dispatch = useDispatch();
  const location = useLocation();
  const state = useTrackedState();
  const { elfData, selection } = state.user;

  const elves = useMemo(() => elfData?.map((elfObject) => {
    const elf = new Elf(elfObject);
    elf.select(selection?.includes(elf.id));
    elf.sortBy(displayType.attr);
    if (!nextElfToUpdate || (elf.isCoolingDown && elf.lastActionTimestamp < nextElfToUpdate.lastActionTimestamp)) {
      setNextElfToUpdate(elf);
    }
    return elf;
  }), [displayType.attr, elfData, nextElfToUpdate, selection]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!nextElfToUpdate) {
        return;
      }
      if (nextElfToUpdate.cooldownSeconds < 2 * 60 * 60) {
        setNextUpdate(1000 + (Math.random() / 1000));
        return;
      }
      setNextUpdate((1000 * 60) + (Math.random() / 1000));
    }, nextUpdate);
    return () => clearInterval(interval);
  }, [nextElfToUpdate, nextUpdate]);

  const sections = useMemo(() => {
    const currentPath = location.pathname.split("/").pop();
    const action = actions.find(({ path }) => path === currentPath) || actions[0];
    const collections = action.sections;

    collections.forEach((collection) => {
      collection.elves = elves?.filter(collection.filter);
      collection.elves?.sort((a, b) => a.sort - b.sort);
    });

    return collections;
  }, [elves, location.pathname]);

  const sectionsDOM = sections.map((section, sectionIndex) => {
    return (section.elves?.length > 0) && (
      <React.Fragment key={sectionIndex}>
        <div className="tmp-flex">
          <h2 key={`${section.label}`}>
            { section.label }:{ " " }
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
                    healthPercentage={elf.healthPercentage}
                    hideBars={elf.didPassive}
                    onClick={() => !elf.didBridge && dispatch({
                      type: "UPDATE_SELECTION",
                      id: elf.id,
                      sectionId: sectionIndex,
                    })}
                  />
                : (
                  <div
                    className="tmp-avatar-list-item"
                    key={`${sectionIndex}-${index}`}
                    onClick={() => !elf.didBridge && dispatch({
                      type: "UPDATE_SELECTION",
                      id: elf.id,
                      sectionId: sectionIndex,
                    })}
                  >
                    <Avatar
                      image={elf.image}
                      isSelected={elf.isSelected}
                      healthPercentage={elf.healthPercentage}
                      hideBars={elf.didPassive}
                    />
                    <span>{ elf.idString }</span>
                    <span>{ elf.actionString }</span>
                    <span>{ elf.levelString }</span>
                    <span>{ elf.cooldownString }</span>
                    { elf.hasInventory && (
                      <>
                        <img className="item-image" src={elf.inventoryObject.image} alt="" />
                        <strong>{ elf.inventoryObject.text }</strong>
                        <span>{ elf.inventoryObject.description }</span>
                      </>
                    ) }
                  </div>
                );
            })
          }
        </div>
      </React.Fragment>
    );
  });

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
      <div className="tmp-scroll">
        { sectionsDOM }
      </div>
      <ElvesDetailsPanel />
      <ElvesActions />
    </div>
  );
}
