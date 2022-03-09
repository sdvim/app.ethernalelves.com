import React, { useState, useMemo } from "react";
import { Avatar } from "../components";
import { Elf } from "../Utils";
import { useDispatch, useTrackedState } from "../Store";
import { actions } from "../data";
import { Link, Outlet } from "react-router-dom";

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
      <Outlet />
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
  const dispatch = useDispatch();
  const state = useTrackedState();
  const { elfData, selection } = state.user;

  const elves = useMemo(() => elfData?.map((elfObject) => {
    const elf = new Elf(elfObject);
    elf.select(selection?.includes(elf.id));
    elf.sortBy(displayType.attr);
    return elf;
  }), [displayType.attr, elfData, selection]);

  const sections = useMemo(() => {
    const collections = [...actions[0].sections];

    collections.forEach((collection) => {
      collection.elves = elves?.filter(collection.filter);
      collection.elves?.sort((a, b) => a.sort - b.sort);
    });

    return collections;
  }, [elves]);

  const sectionsDOM = useMemo(() => sections.map((section, sectionIndex) => {
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
  }), [dispatch, sections, viewType.view]);

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
