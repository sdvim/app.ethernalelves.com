import React, { useState, useMemo, useEffect } from "react";
import { Avatar } from "../../components";
import { useDispatch, useTrackedState } from "../../Store";
import { actions, Elf } from "../../data";
import { useLocation } from "react-router-dom";

export function ElvesCollection({displayType: { attr }, viewType: { view }}) {
  const [nextElfToUpdate, setNextElfToUpdate] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(1000);
  const dispatch = useDispatch();
  const location = useLocation();
  const { user: { elfData, selection } } = useTrackedState();

  const elves = useMemo(() => elfData?.map((elfObject) => {
    const elf = new Elf(elfObject);
    elf.select(selection?.includes(elf.id));
    elf.sortBy(attr);
    if (!nextElfToUpdate || (elf.isCoolingDown && elf.lastActionTimestamp < nextElfToUpdate.lastActionTimestamp)) {
      setNextElfToUpdate(elf);
    }
    return elf;
  }), [attr, elfData, nextElfToUpdate, selection]);

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

  return (
    <div className="ElvesCollection">
      { sections.map((section, sectionIndex) => 
        (section.elves?.length > 0) && (
          <React.Fragment key={sectionIndex}>
            <h3 key={`${section.label}`} className="ElvesCollection__header">
              <span>{ section.label }</span>
              <span className="ElvesCollection__count">
                { section.elves.length } { section.elves.length === 1 ? "Elf" : "Elves" }
              </span>
            </h3>
            <div key={`${sectionIndex}-view`} className={`ElvesCollection__${view}`}>
              {
                section.elves.map((elf, index) => {
                  const display = (() => {
                    switch (attr) {
                      case "lastActionTimestamp": return elf.isCoolingDown && elf.cooldownString;
                      case "statLevel": return elf.levelString;
                      case "weaponTier": return elf.weaponTierString;
                      case "id":
                      default: return elf.idString;
                    }
                  })();
                  const onClick = () => !elf.didBridge && dispatch({
                    type: "UPDATE_SELECTION",
                    id: elf.id,
                    sectionId: sectionIndex,
                  });
                  return (view === "grid")
                    ? <Avatar
                        key={`${sectionIndex}-${index}`}
                        image={elf.image}
                        isSelected={elf.isSelected}
                        healthPercentage={elf.healthPercentage}
                        hideBars={!elf.isCoolingDown}
                        display={display}
                        onClick={onClick}
                      />
                    : <div
                        className="list-item"
                        key={`${sectionIndex}-${index}`}
                        onClick={onClick}
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
                })
              }
            </div>
          </React.Fragment>
        )
      )}
    </div>
  );
}